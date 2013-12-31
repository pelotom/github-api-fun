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

$.get('https://api.github.com/').done(function (directory) {
  var repoUrl = UriTemplate.parse(directory.repository_url).expand({ owner: 'scala-ide', repo: 'scala-ide' });
  $.get(repoUrl).done(function (repo) {
    var pullsUrl = UriTemplate.parse(repo.pulls_url).expand({ number: '598' });
    $.get(pullsUrl).done(function (pr) {
      ractive.set('pr', pr);
      $.when(
        $.get(pr._links.comments.href),
        $.get(pr._links.review_comments.href)
      ).done(function (
        issueComments,
        reviewComments
      ) {
        var comments = issueComments[0].concat(reviewComments[0]);
        comments.sort(function (c1, c2) {
          return new Date(c1.created_at).getTime() - new Date(c2.created_at).getTime();
        })
        ractive.set('comment_list', comments);
      });
    });
  });
});
