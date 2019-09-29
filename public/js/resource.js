//- Replace the input of the resource with filename
document.getElementById('file').onchange = function() {
  const filename = this.value.replace(/^.*\\/, '');
  document.getElementById('file-label').innerHTML = filename;
};
