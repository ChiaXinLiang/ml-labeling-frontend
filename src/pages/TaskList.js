import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Nav from "./Nav";
import "./TaskList.css";
import ButtonGroup from "../components/buttons/ButtonGroup";
import DataTable from "../components/tables/DataTable";
import ImportModal from "../components/modals/ImportModal";
import { taskListColumns } from "../constants/tableColumns";

export default function TaskList({ ProjectData }) {
  const [projectDatas, setProjectData] = useState([]);
  const [datas, setDatas] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();

  console.log('Current project ID:', id);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/tasks?project=${id}`, {
        headers: {
          'Authorization': `Token ${process.env.REACT_APP_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (Array.isArray(data.tasks)) {
        const dataWithSrc = await Promise.all(data.tasks.map(async (item) => {
          const imagePath = item.data.image;
          const url = `${process.env.REACT_APP_LABEL_STUDIO_HOST}${imagePath}`;
          const imageResponse = await fetch(url, {
            headers: {
              'Authorization': `Token ${process.env.REACT_APP_API_TOKEN}`,
              'Content-Type': 'application/json'
            }
          });

          const imageBlob = await imageResponse.blob();
          const imageUrl = URL.createObjectURL(imageBlob);

          const processorResponse = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/accounts/task/processor/${item.id}`, {
            method: "GET",
            headers: {
              'Authorization': `Token ${process.env.REACT_APP_API_TOKEN}`,
              'Content-Type': 'application/json'
            }
          });

          const processorData = await processorResponse.json();
          return {
            id: item.id,
            Complete: item.is_labeled ? "是" : "否",
            "Total annotations": item.total_annotations,
            "Canceled annotations": item.cancelled_annotations,
            "Total Predictions": item.total_predictions,
            "Annotated By": processorData.processor.annotator || item.annotators.join(", "),
            "Verified By": processorData.processor.verifier || "",
            file: {
              src: imageUrl,
              alt: "Image",
            },
          };
        }));

        setDatas(dataWithSrc);
      } else {
        setDatas([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Error fetching data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setProjectData(ProjectData.results);
  }, [ProjectData]);

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleRowClick = async (params) => {
    const profile = JSON.parse(localStorage.getItem("profile"));
    if (profile) {
      try {
        const response = await fetch(`${process.env.REACT_APP_LAYER2_ENDPOINT}/accounts/task/processor`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Token ${process.env.REACT_APP_API_TOKEN}`
          },
          body: JSON.stringify({
            task_id: params.row.id.toString(),
            processor: {"annotator":profile.name, "verifier":""}
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to update processor');
        }
        
        const data = await response.json();
        console.log(JSON.stringify(data));

        const taskId = params.id;
        const url = `${process.env.REACT_APP_LABEL_STUDIO_HOST}/projects/${id}/data?task=${taskId}`;
        window.location.href = url;
      } catch (error) {
        console.error("Error:", error);
        alert("Error updating processor. Please try again.");
      }
    }
  };

  const handleDelete = async () => {
    console.log('Delete button clicked');
    console.log('Selected IDs:', selectedIds);

    if (!selectedIds.length) {
      alert("Please select items to delete");
      return;
    }

    if (!window.confirm("Are you sure you want to delete the selected items?")) {
      return;
    }

    setIsLoading(true);
    
    try {
      const deleteUrl = `${process.env.REACT_APP_LAYER2_ENDPOINT}/tasks/delete/?ids=${JSON.stringify(selectedIds)}`;
      console.log('Deleting tasks at URL:', deleteUrl);

      const response = await fetch(deleteUrl, {
        method: "DELETE",
        headers: {
          'Authorization': `Token ${process.env.REACT_APP_API_TOKEN}`,
          'Content-Type': 'application/json'
        },
      });

      console.log('Delete response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Delete error response:', errorText);
        throw new Error(`Failed to delete tasks: ${errorText}`);
      }

      console.log('Successfully deleted tasks');

      // Update UI immediately
      setDatas(prevDatas => prevDatas.filter(task => !selectedIds.includes(task.id)));
      setSelectedIds([]);
      
      alert("任務刪除成功");
      
      // Refresh data from server
      await fetchData();

    } catch (error) {
      console.error("Error deleting tasks:", error);
      alert("刪除任務時發生錯誤: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!selectedIds.length) {
      alert("Please select items to verify");
      return;
    }

    const profile = JSON.parse(localStorage.getItem("profile"));
    if (!profile || !profile.name) {
      alert("Profile not found. Please log in again.");
      return;
    }

    setIsLoading(true);
    try {
      for (const taskId of selectedIds) {
        const response = await fetch(`${process.env.REACT_APP_LAYER2_ENDPOINT}/accounts/task/processor`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Token ${process.env.REACT_APP_API_TOKEN}`
          },
          body: JSON.stringify({
            task_id: taskId.toString(),
            processor: {
              annotator: "",
              verifier: profile.name,
            },
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to verify task ${taskId}`);
        }
      }

      alert("任務驗證成功");
      await fetchData();
    } catch (error) {
      console.error("Error verifying tasks:", error);
      alert("Error verifying tasks. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_LAYER2_ENDPOINT}/export-project/${id}`, {
        method: "GET",
        headers: {
          'Authorization': `Token ${process.env.REACT_APP_API_TOKEN}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `yolo_export_${id}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting data:", error);
      alert("Error exporting data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectionChange = (newSelection) => {
    console.log('Selection changed:', newSelection);
    setSelectedIds(newSelection);
  };

  let projectDataById;
  if (Array.isArray(projectDatas)) {
    projectDataById = projectDatas.find((project) => project.id === Number(id));
  }

  return (
    <div>
      <Nav projectDataById={projectDataById} />
      <ButtonGroup
        onImport={() => setImportModalOpen(true)}
        onExport={handleExport}
        onDelete={handleDelete}
        onVerify={handleVerify}
      />
      <ImportModal
        openModal={importModalOpen}
        closeModal={() => setImportModalOpen(false)}
        projectId={id}
        onSuccess={() => {
          fetchData();
        }}
      />
      <DataTable
        rows={datas}
        columns={taskListColumns}
        onRowClick={handleRowClick}
        selectedIds={selectedIds}
        onSelectionChange={handleSelectionChange}
        loading={isLoading}
        checkboxSelection
      />
    </div>
  );
}
