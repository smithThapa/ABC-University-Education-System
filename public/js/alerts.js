export const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) {
    el.parentElement.removeChild(el);
  }
};

export const showAlert = (type, strongMsg, msg) => {
  //hide all alerts
  hideAlert();
  //make up HTML with the alert
  const markup = `
  <div class="alert alert-${type} alert-dismissible fade show text-center" role="alert">
    <strong>${strongMsg}</strong> ${msg}
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>`;
  //insert HTML
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  //set timeout to hide alert
  window.setTimeout(hideAlert, 5000);
};
