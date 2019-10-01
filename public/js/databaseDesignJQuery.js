/* eslint-disable no-undef */
$(document).ready(function() {
  $('#dataTable').DataTable({
    responsive: true
  });
  $('#dataResources').DataTable({ order: [[0, 'desc']], responsive: true });
  $('#dataTableNews').DataTable({
    order: [[0, 'desc']],
    ordering: false,
    lengthMenu: [3, 6, 9],
    info: false,
    lengthChange: false,
    searching: false,
    responsive: true
  });
  $('#dataTableAnnouncements').DataTable({
    order: [[0, 'desc']],
    ordering: false,
    lengthMenu: [1, 2, 3],
    info: false,
    lengthChange: false,
    searching: false,
    responsive: true
  });
  $('#dataTableStatistics').DataTable({
    ordering: false,
    lengthMenu: [100],
    info: false,
    lengthChange: false,
    searching: false,
    paging: false,
    responsive: true
  });
});
