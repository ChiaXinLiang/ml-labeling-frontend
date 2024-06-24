import Cookies from 'js-cookie';
function getCSRFToken() {
  return Cookies.get('csrftoken');
}
export { getCSRFToken };