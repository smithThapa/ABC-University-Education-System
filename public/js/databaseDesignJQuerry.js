$(document).ready(function() {
  $('#dataTable').DataTable();
  $('#dataResources').DataTable({ order: [[0, 'desc']] });
  $('#dataTableNews').DataTable({
    order: [[0, 'desc']],
    ordering: false,
    lengthMenu: [3, 6, 9],
    info: false,
    lengthChange: false,
    searching: false
  });
  $('#dataTableAnnouncements').DataTable({
    order: [[0, 'desc']],
    ordering: false,
    lengthMenu: [1, 2, 3],
    info: false,
    lengthChange: false,
    searching: false
  });
});
