export const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) {
    el.parentElement.removeChild(el);
  }
};

//typer either 'sucess' or 'fail'
export const showAlert = (type, strongMsg, msg) => {
  hideAlert();
  const markup = `
  <div class="alert alert-${type} alert-dismissible fade show text-center" role="alert">
    <strong>${strongMsg}</strong> ${msg}
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);

  window.setTimeout(hideAlert, 5000);
};
