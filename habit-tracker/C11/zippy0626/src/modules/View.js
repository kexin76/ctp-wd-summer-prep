import { format } from "date-fns";
import { QuantitativeHabit } from "./habit.js";
import imgUrl from "/edit-icon.svg?url";

const View = {
  query(selector) {
    return document.querySelector(selector);
  },

  scrollToThisMonth() {
    // will scroll to current month for all habit cards
    const currentMonth = new Date().getMonth(); // 0–11

    // reset to previous current view
    const [x, y] = [window.scrollX, window.scrollY];

    document.querySelectorAll(".month-container").forEach((container) => {
      const targetMonth = container.querySelector(`.month[data-month-index ='${currentMonth}']`);
      // If the current width/height is less than actual width/height (meaning scrollable)
      if (container.scrollWidth > container.clientWidth || container.scrollHeight > container.clientHeight) {
        targetMonth.scrollIntoView({
          behavior: "instant",
          inline: "center", // for horizontal
          block: "center", // for vertical
        });
      }
    });

    window.scrollTo(x, y);
  },

  scrollToMonthForHabit(monthIndex, habitName) {
    // will scroll to month for a given habit, thru it's habit card
    const [x, y] = [window.scrollX, window.scrollY];
    const monthContainer = document
      .querySelector(`.habit-card[data-habit-name ='${habitName}']`)
      .querySelector(".month-container");

    const targetMonth = monthContainer.querySelector(`.month[data-month-index ='${monthIndex}']`);
    if (
      // If the current width/height is less than actual width/height (meaning scrollable)
      monthContainer.scrollWidth > monthContainer.clientWidth ||
      monthContainer.scrollHeight > monthContainer.clientHeight
    ) {
      targetMonth.scrollIntoView({
        behavior: "instant",
        inline: "center",
        block: "center",
      });
    }
    window.scrollTo(x, y);
  },

  // --- Overlay and Add Habit Btn ---
  onAddHabitBtnClick(callback) {
    View.query(".user-add-habit").addEventListener("click", callback);
  },

  onModalOverlayClick(callback) {
    View.query(".modal-overlay").addEventListener("click", callback);
  },

  // --- Habit Related Methods ---
  habit: {
    displayHabits(habits) {
      const habitContainer = View.query(".user-habits-container");
      habitContainer.innerHTML = "";

      if (habits) {
        for (const habit of habits) {
          const habitCard = this.getHabitCard(habit);
          habitContainer.appendChild(habitCard);
        }
      } else {
        // remember to handle no habits found later
      }
    },

    getHabitCard(habit) {
      const year = new Date().getFullYear();

      const monthsContainer = document.createElement("div");
      monthsContainer.classList.add("month-container");

      // Loop through the months
      for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
        const month = document.createElement("div");
        month.classList.add("month");
        // For scrolling effect
        month.dataset.monthIndex = monthIndex;

        let firstDay = new Date(year, monthIndex, 1);
        let lastDay = new Date(year, monthIndex + 1, 0);

        // Month name seperator for each month
        const monthName = document.createElement("p");
        monthName.classList.add("month-name");
        monthName.textContent = firstDay.toLocaleString("default", { month: "short" });
        monthsContainer.appendChild(monthName);

        // Loop through all days in the month && create boxes
        for (let day = new Date(firstDay); day <= lastDay; day.setDate(day.getDate() + 1)) {
          const box = document.createElement("div");
          box.classList.add("date-box");

          // Highlight today's date
          if (format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")) {
            box.classList.add("todays-date");
          }

          box.title = format(day, "MM-dd-yyyy");
          box.dataset.date = format(day, "yyyy-MM-dd");

          // Make green if done on that day
          let accessDate = format(day, "yyyy-MM-dd");
          habit.getCompletionOnDate(accessDate) === true ? box.classList.add("done") : undefined;

          month.appendChild(box);
        }

        monthsContainer.appendChild(month);
      }

      const habitCard = document.createElement("article");
      habitCard.classList.add("habit-card");
      habitCard.classList.add("flex-col");

      const habitHeading = document.createElement("h2");
      habitHeading.classList.add("habit-card-name");
      habitHeading.textContent = habit.name;

      const habitCate = document.createElement("h3");
      habitCate.classList.add("habit-card-category");
      habitCate.textContent = habit.category;

      const habitDesc = document.createElement("p");
      habitDesc.classList.add("habit-desc");
      // habitDesc.textContent = "Description: " + habit.description;
      habit.description ? (habitDesc.textContent = "Description: " + habit.description) : (habitDesc.textContent = "");

      const habitEditIcon = document.createElement("img");
      habitEditIcon.classList.add("edit-icon");
      habitEditIcon.src = imgUrl;

      habitCard.appendChild(habitHeading);
      habitCard.appendChild(habitCate);
      habitCard.appendChild(monthsContainer);
      habitCard.appendChild(habitDesc);
      habitCard.appendChild(habitEditIcon);

      // Attach dataset attributes
      habitCard.dataset.habitName = habit.name;
      habitCard.dataset.category = habit.category;

      return habitCard;
    },

    getClickedDateData(target) {
      if (target.classList.contains("date-box")) {
        const data = {};
        const card = target.closest(".habit-card");
        data.displayDate = target.title;
        data.accessDate = target.dataset.date;
        data.habitName = card.dataset.habitName;
        data.category = card.dataset.category;
        return data;
      } else {
        return undefined;
      }
    },

    onHabitCardClick(callback) {
      View.query(".user-habits-container").addEventListener("click", callback);
    },
  },

  // --- Log Modal Methods ---
  logModal: {
    show() {
      View.query(".log-modal").classList.remove("hidden");
      View.query(".modal-overlay").classList.remove("hidden");
    },

    hide() {
      View.query(".log-modal").classList.add("hidden");
      View.query(".modal-overlay").classList.add("hidden");
    },

    clear() {
      View.query("#log-habit-form").reset();
    },

    getFormData() {
      const modal = View.query(".log-modal");
      const data = new FormData(modal.querySelector("#log-habit-form"));
      const obj = {};
      for (const pair of data.entries()) {
        let key = pair[0];
        let value = pair[1];
        // Convert str data to correct data types
        if (key === "completed") {
          value === "true" ? (value = true) : (value = false);
        }
        if (key === "quantity") {
          value instanceof String ? (value = Number(value)) : (value = Number(value));
        }
        obj[key] = value;
      }
      obj.accessDate = modal.dataset.accessDate;
      obj.habitName = modal.dataset.habitName;
      return obj;
    },

    updateFormView(dateData, habit) {
      // for getFormData
      const modal = View.query(".log-modal");
      modal.dataset.accessDate = dateData.accessDate;
      modal.dataset.habitName = dateData.habitName;

      const heading = View.query(".log-modal-heading");
      heading.textContent = `Log for ${dateData.displayDate}`;

      const habitName = View.query(".log-modal-habit-name");
      habitName.textContent = `${dateData.habitName}`;
      habitName.innerHTML += `<span class="category"> (${dateData.category})</span>`;

      const completedYes = View.query("#log-completed");
      const completedNo = View.query("#log-not-completed");

      habit.getCompletionOnDate(dateData.accessDate) === true
        ? (completedYes.checked = true)
        : (completedNo.checked = true);

      const quantityInput = View.query("#log-quantity");
      const quantityLabel = View.query("label[for='log-quantity']");

      if (habit instanceof QuantitativeHabit) {
        quantityInput.classList.remove("hidden");
        quantityLabel.classList.remove("hidden");
        quantityInput.value = habit.getQuantityOnDate(dateData.accessDate);
        let format = habit.getQuantityFormat()[0].toUpperCase() + habit.getQuantityFormat().slice(1).toLowerCase();
        quantityLabel.textContent = `${format} Completed:`;
      } else {
        quantityInput.classList.add("hidden");
        quantityLabel.classList.add("hidden");
      }

      const notesInput = View.query("#log-notes");
      notesInput.value = habit.getNotesOnDate(dateData.accessDate);
    },

    onSubmitClick(callback) {
      View.query("#log-habit-form").addEventListener("submit", callback);
    },

    onCancelClick(callback) {
      View.query("div.log-form-buttons button[type='reset']").addEventListener("click", callback);
    },
  },

  // --- Add Habit Modal Methods ---
  addHabitModal: {
    show() {
      View.query(".add-habit-modal").classList.remove("hidden");
      View.query(".modal-overlay").classList.remove("hidden");
    },

    hide() {
      View.query(".add-habit-modal").classList.add("hidden");
      View.query(".modal-overlay").classList.add("hidden");
    },

    clear() {
      View.query("#add-habit-modal-form").reset();
    },

    showHabitQuantityFormat() {
      View.query(".habit-quantity-format").classList.remove("hidden");
      View.query("#habit-quantity-format").required = true;
    },

    hideHabitQuantityFormat() {
      View.query(".habit-quantity-format").classList.add("hidden");
      View.query("#habit-quantity-format").required = false;
    },

    getFormData() {
      const data = new FormData(View.query("#add-habit-modal-form"));
      const obj = {};
      for (const pair of data.entries()) {
        let key = pair[0];
        let val = pair[1];
        obj[key] = val;
      }
      return obj;
    },

    onSubmitClick(callback) {
      View.query("#add-habit-modal-form").addEventListener("submit", callback);
    },

    onCancelClick(callback) {
      View.query(".cancel-habit-btn").addEventListener("click", callback);
    },

    onHabitTypeClick(callback) {
      View.query("#complete").addEventListener("click", callback);
      View.query("#number").addEventListener("click", callback);
    },
  },

  // --- Edit Habit Modal Methods ---
  editHabitModal: {
    show() {
      View.query(".edit-habit-modal").classList.remove("hidden");
      View.query(".modal-overlay").classList.remove("hidden");
    },

    hide() {
      View.query(".edit-habit-modal").classList.add("hidden");
      View.query(".modal-overlay").classList.add("hidden");
    },

    clear() {
      View.query(".edit-habit-form").reset();
    },

    updateFormView(habit) {
      View.query(".edit-habit-form").dataset.oldHabitName = habit.name;
      View.query(".edit-modal-heading").textContent = `Edit "${habit.name}"`;
      View.query("#edit-name").value = habit.name || "";

      // Handle Boolean Habits
      if (!(habit instanceof QuantitativeHabit)) {
        View.query(".edit-format").classList.add("hidden");
        View.query("#edit-format").required = false;
      } else {
        View.query(".edit-format").classList.remove("hidden");
        View.query("#edit-format").required = true;
      }

      View.query("#edit-format").value = habit.quantityFormat || "";
      View.query("#edit-category").value = habit.category || "";
      View.query("#edit-desc").value = habit.description || "";
    },

    getFormData() {
      const entries = new FormData(View.query(".edit-habit-form"));
      const data = {};

      for (const pair of entries) {
        let key = pair[0];
        let value = pair[1];
        data[key] = value;
      }

      data.oldHabitName = View.query(".edit-habit-form").dataset.oldHabitName;

      return data;
    },

    onSubmitClick(callback) {
      View.query(".edit-habit-form").addEventListener("submit", callback);
    },

    onCancelClick(callback) {
      View.query(".edit-form-btns button[type='reset']").addEventListener("click", callback);
    },

    onDeleteClick(callback) {
      View.query(".edit-form-btns button[type='button']").addEventListener("click", callback);
    },
  },

  confirmModal: {
    show() {
      View.query(".modal-overlay").classList.remove("hidden");
      View.query(".confirm-delete-modal").classList.remove("hidden");
    },

    hide() {
      View.query(".modal-overlay").classList.add("hidden");
      View.query(".confirm-delete-modal").classList.add("hidden");
    },

    clear() {
      View.query(".confirm-delete-modal-form").reset();
    },

    showInvalidInputMsg() {
      View.query(".confirm-habit-name .confirm-delete-modal-warning").classList.remove("hidden");
    },

    hideInvalidInputMsg() {
      View.query(".confirm-habit-name .confirm-delete-modal-warning").classList.add("hidden");
    },

    getFormData() {
      const habitName = View.query("#confirm-habit-name").value;
      return habitName;
    },

    updateFormView(habit) {
      View.query(".confirm-delete-modal-heading").textContent = `Are you sure you want to delete "${habit.name}"?`;
      View.query("#confirm-habit-name").placeholder = `TYPE "${habit.name}" HERE`;
    },

    onSubmitClick(callback) {
      View.query(".confirm-delete-modal-form").addEventListener("submit", callback);
    },

    onCancelClick(callback) {
      View.query(".confirm-delete-modal-btns button[type='reset']").addEventListener("click", callback);
    },
  },
};

export default View;
