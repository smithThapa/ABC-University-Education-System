/* eslint-disable no-undef */
$(document).ready(function() {
  // check when the select is changes
  $('#inputCreationForumType')
    .change(async function() {
      // forum type with no spaces
      const type = $(this)
        .val()
        .split(' ')
        .join('');

      // array with titles
      const titlesArray = [];

      // iterate through all titles to push into the array
      $(`#forumType${type}List li`).each(function() {
        titlesArray.push({
          id: $(this).data().forumId,
          slug: $(this).data().forumSlug,
          title: $(this).text()
        });
      });

      //variable with options HTML to append in the select
      let htmlOptions = '<option value="">SELECT A FORUM TITLE</option>';

      //add the option to the html string of each element in the array
      titlesArray.forEach(element => {
        htmlOptions += `<option data-forum-id= ${element.id} data-forum-slug=${element.slug}> ${element.title} </option>`;
      });

      // add the options to the select Forum title
      $('#inputCreationForumTitle').html(htmlOptions);
    })
    //- add extra change, for when page is loaded
    .change();
});
