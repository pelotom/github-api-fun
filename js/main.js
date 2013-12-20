marked.setOptions({
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false,
});

var ractive = new Ractive({
  el: 'body',
  template: '#template',
  data: {
    marked: marked,
    formatDate: function (dateString) {
      return new Date(dateString).toString();
    }
  }
});

$.get('https://api.github.com/repos/scala-ide/scala-ide/pulls/598').done(function (pr) {
  ractive.set('pr', pr);
  var fIssueComments = $.get(pr._links.comments.href);
  var fReviewComments = $.get(pr._links.review_comments.href);
  $.when(fIssueComments, fReviewComments).done(function (issueComments, reviewComments) {
    var comments = issueComments[0].concat(reviewComments[0]);
    comments.sort(function (c1, c2) {
      return new Date(c1.created_at).getTime() - new Date(c2.created_at).getTime();
    })
    ractive.set('comment_list', comments);
  });
});