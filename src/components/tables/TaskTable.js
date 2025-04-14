import React from 'react';
import DataTable from './DataTable';
import { taskListColumns } from '../../constants/tableColumns';

function TaskTable({ datas, selectedIds, setSelectedIds, projectId, isLoading }) {
  const fetchSession = async (projectId, taskId) => {
    try {
      console.log("Fetching session ID & CSRF token...");

      const LS_HOST = process.env.REACT_APP_LABEL_STUDIO_HOST;
      if (!LS_HOST) {
        console.error("Environment variable REACT_APP_LABEL_STUDIO_HOST is not set!");
        return;
      }

      const TARGET_PAGE = `/projects/${projectId}/data/?tab=0&task=${taskId}`;
      const loginPage = `${LS_HOST}/user/login/`;

      console.log("Visiting login page to retrieve session cookies...");
      // Using credentials: "include" to ensure cookies are sent and stored
      await fetch(loginPage, {
        credentials: "include",
        mode: "cors" // Explicitly set CORS mode
      });
      console.log("Login page visited successfully. Redirecting...");

      window.location.href = `${LS_HOST}${TARGET_PAGE}`;
    } catch (error) {
      console.error("fetchSession encountered an error:", error);
    }
  };

  const handleRowClick = async (projectId, params) => {
    try {
      console.log("Checking session ID & CSRF token...");

      const LS_HOST = process.env.REACT_APP_LABEL_STUDIO_HOST;
      if (!LS_HOST) {
        console.error("Environment variable REACT_APP_LABEL_STUDIO_HOST is not set!");
        return;
      }

      const taskId = params.row?.id || params.id;

      if (!projectId || !taskId) {
        console.error("Project ID or Task ID is missing.", { projectId, taskId });
        return;
      }

      let existingSession = document.cookie.match(/sessionid=([^;]+)/)?.[1];
      let existingCsrf = document.cookie.match(/csrftoken=([^;]+)/)?.[1];

      if (!existingSession || !existingCsrf) {
        console.log("Session ID or CSRF token missing, initiating fetchSession()...");
        await fetchSession(projectId, taskId);
        return;
      }

      console.log("Session ID & CSRF token found, redirecting to Label Studio...");

      // Use the base URL with the correct path to avoid CORS issues
      const url = `${LS_HOST}/projects/${projectId}/data?task=${taskId}`;
      console.log(`Redirecting to: ${url}`);

      // Direct navigation to avoid CORS issues with fetch
      window.location.href = url;
    } catch (error) {
      console.error("Error occurred during handleRowClick:", error);
    }
  };

  return (
    <DataTable
      rows={datas}
      columns={taskListColumns}
      onRowClick={(params) => handleRowClick(projectId, params)}
      selectedIds={selectedIds}
      onSelectionChange={setSelectedIds}
      loading={isLoading}
      checkboxSelection
    />
  );
}

export default TaskTable;
