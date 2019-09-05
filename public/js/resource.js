document.getElementById('file').onchange = function() {
  const filename = this.value.replace(/^.*\\/, '');
  document.getElementById('file-label').innerHTML = filename;
};
