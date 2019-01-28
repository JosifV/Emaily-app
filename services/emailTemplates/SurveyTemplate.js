const keys = require("../../config/keys");
module.exports = survey => {
  // obrati paznju, ovde se koristi ` znak a ne ' ... taj znak se nalazi pored jedinice, i ovde nam pomaze jer pomocu njega mozemo da vratimo vise razlicitih redova htmla
  return `<html>
  <body>
    <div style="text-align:center">
      <h3>Do you like our app?</h3>
      <p>${survey.body}</p>
      <div>
        <a href="${keys.redirectDomain}/api/surveys/${survey.id}/yes">Yes</a>
      </div>
      <div>
        <a href="${keys.redirectDomain}/api/surveys/${survey.id}/no">No</a>
      </div>
    </div>
  </body>
</html>`;
};
