$(document).ready(function() {
  $('#dataTable').DataTable();
  $('#dataTableNews').DataTable({
    order: [[0, 'desc']]
  });
});
