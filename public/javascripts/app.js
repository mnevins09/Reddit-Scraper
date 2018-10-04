$(document).ready(function () {
  // Scrapes articles
  $(document).on('click', '#scrape', function (data) {
    data.preventDefault();
    $.ajax({
      url: '/scrape',
      type: 'GET'
    })
      .then(function (response) {
        $('#numArticles').text(response.length);
        $('#modalScraped').modal('show');
      })
  })

  // when user exits modal, stay on the page
  $('#modalScraped').on('hidden.bs.modal', function (data) {
    window.location.href = '/';
  });

  // saves the article
  $(document).on('click', '#saveArticle', function (data) {
    var articleId = $(this).data('id');
    console.log(articleId)
    $.ajax({
      url: '/articles/save/' + articleId,
      type: 'GET'
    })
      .then(function (response) {
        window.location.href = '/'
      })
  });

  // deletes article
  $('.deletearticles').on('click', function (data) {
    data.preventDefault();
    var id = $(this).data('id');
    $.ajax({
      url: '/articles/deleteArticle/' + id,
      type: 'DELETE'
    })
      .then(function (response) {
        window.location.href = '/articles/viewSaved'
      })
  });

  // submits note to be display
  $('#submitNote').on('click', function (data) {
    data.preventDefault();
    var articleId = $(this).data('id');
    var body = $('#noteInput').val().trim()
    var noteObj = {
      articleId,
      body
    }
    if (!$("#noteInput").val()) {
      $('.modal-body').append('\n' + 'Please enter a note to save!')
    } else {
      $.ajax({
        url: '/notes/post/' + articleId,
        type: 'POST',
        data: noteObj
      })
        .then(function (response) {
          window.location.href = '/articles/viewSaved'
        })
    }
  });

  //function that displays note in noteModal
  function displayNote(element, articleId) {
    // element.preventDefault()
    // if (notes != val()){
    var $deleteButton = $('<button>')
      .text('X')
      .addClass('deleteNote');
    var $note = $('<div>')
      .text(element.body)
      .append($deleteButton)
      .attr('data-note-id', element._id)
      .attr('data-article-id', articleId)
      .addClass('note')
      .appendTo('#noteArea')
    // }
  }

  // displays and saves note in modal
  $(document).on('click', '.addNote', function (data) {
    data.preventDefault();
    $('#noteInput').val('');
    var id = $(this).data('id');
    $('#submitNote, #noteInput').attr('data-id', id)
    $.ajax({
      url: '/notes/getNotes/' + id,
      type: 'GET'
    })
      .then(function (response) {
        $('#noteArea').empty();
        $.each(response.notes, function (i, item) {
          displayNote(item, id)
        });
        $('#noteModal').modal('show');
      })
  });

  //deletes note from modal
  $(document).on('click', '.deleteNote', function (event) {
    var item = $(this);
    var ids = {
      noteId: $(this).parent().data('note-id'),
      articleId: $(this).parent().data('article-id')
    };
    $.ajax({
      url: '/notes/deleteNote',
      type: 'POST',
      data: ids
    })
      .then(function (response) {
        item.parent().remove();
      });
  });
})