(function () {
  "use strict";

  var modal = document.getElementById("checklist-signup");
  if (!modal) return;

  var form = modal.querySelector("form");
  var email = modal.querySelector('input[type="email"]');
  var submitButton = modal.querySelector("button.primary");
  var loadingButton = modal.querySelector("button.loading");
  var status = modal.querySelector(".checklist-status");
  var firstTrigger = null;
  var requestTimer = null;
  var checklistPath = "/501c3-quick-start-checklist.pdf";

  function setBusy(isBusy) {
    submitButton.disabled = isBusy;
    submitButton.hidden = isBusy;
    loadingButton.hidden = !isBusy;
    email.disabled = isBusy;
  }

  function showError(message) {
    window.clearTimeout(requestTimer);
    setBusy(false);
    status.dataset.friendly = "true";
    status.textContent = message;
    status.classList.remove("d-none");
  }

  function resetFormState() {
    window.clearTimeout(requestTimer);
    setBusy(false);
    delete status.dataset.friendly;
    status.textContent = "";
    status.classList.add("d-none");
  }

  function openModal(event) {
    if (event) event.preventDefault();
    firstTrigger = event ? event.currentTarget : null;
    modal.hidden = false;
    document.body.classList.add("checklist-modal-open");
    resetFormState();
    window.setTimeout(function () { email.focus(); }, 0);
  }

  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove("checklist-modal-open");
    if (firstTrigger) firstTrigger.focus();
  }

  document.querySelectorAll("[data-checklist-signup]").forEach(function (trigger) {
    trigger.addEventListener("click", openModal);
  });

  modal.querySelectorAll("[data-checklist-close]").forEach(function (control) {
    control.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !modal.hidden) closeModal();
  });

  form.addEventListener("submit", function (event) {
    delete status.dataset.friendly;
    status.textContent = "";
    status.classList.add("d-none");

    if (!email.value.trim()) {
      event.preventDefault();
      event.stopImmediatePropagation();
      showError("Please enter your email address.");
      email.focus();
      return;
    }

    if (!email.checkValidity()) {
      event.preventDefault();
      event.stopImmediatePropagation();
      showError("Please enter a valid email address.");
      email.focus();
      return;
    }

    if (submitButton.disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }

    setBusy(true);
    requestTimer = window.setTimeout(function () {
      showError("We couldn't complete your signup. Please check your connection and try again—your email is still in the box.");
    }, 15000);
  }, true);

  var serverErrorObserver = new MutationObserver(function () {
    if (status.textContent.trim() && !status.classList.contains("d-none") && !status.dataset.friendly) {
      showError("We couldn't complete your signup. Please try again—your email is still in the box.");
    }
  });
  serverErrorObserver.observe(status, { childList: true, characterData: true, subtree: true });

  window.ml_webform_success_45654074 = function () {
    window.clearTimeout(requestTimer);
    var formRow = modal.querySelector(".row-form");
    var successRow = modal.querySelector(".row-success");
    var downloadLink = modal.querySelector("[data-checklist-download]");
    formRow.hidden = true;
    successRow.hidden = false;
    downloadLink.href = checklistPath;
    downloadLink.download = "501c3-quick-start-checklist.pdf";
    downloadLink.focus();
    downloadLink.click();
  };
})();
