$(function(){
  function buildHTML(message){
    var image = ( message.image ) ? `<img class= "message__list__lower__image" src=${message.image} >` : "";

    var html = `<div class="message__list", data-message-id="${message.id}">
        <div class = message__list>
          <div class ="message__list__upper">
            <div class ="message__list__upper__sender">
              ${message.user_name}
            </div>
            <div class="message__list__upper__date">
              ${message.created_at}
            </div>
          </div>
          <div class="message__list__lower">
            <p class="message__list__lower__text">
              ${message.text}
            </p>
            ${image}
          </div>
        </div>`
    return html;
  }
  $('#new_message').on('submit', function(e){
    e.preventDefault()
    var formData = new FormData(this);
    var url = $(this).attr('action')
    $.ajax({
      url: url,
      type: 'POST',
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
     .done(function(data){
       var html = buildHTML(data);
       $('.messages').append(html);
       $('.messages').animate({ scrollTop: $('.messages')[0].scrollHeight});
       $('form')[0].reset();
     })
     .fail(function() {
       alert("メッセージ送信に失敗しました");
     })
     return false;
  })

  var reloadMessages = function() {
    last_message_id = $('.message__list:last').data("message-id");
    $.ajax({
      url: "api/messages",
      type: 'get',
      dataType: 'json',
      data: {id: last_message_id}
    })
    .done(function(messages) {
      if (messages.length !== 0) {
      var insertHTML = '';
      $.each(messages, function(i, message) {
        insertHTML += buildHTML(message)
      });
      $('.messages').append(insertHTML);
      $('.messages').animate({ scrollTop: $('.messages')[0].scrollHeight});
      $("#new_message")[0].reset();
      $(".block__input__box__send-btn").prop("disabled", false);
      }
    })
    .fail(function(){
      aleat('error');
    });
  };
  if (document.location.href.match(/\/groups\/\d+\/messages/)) {
  setInterval(reloadMessages, 7000);
  }
});