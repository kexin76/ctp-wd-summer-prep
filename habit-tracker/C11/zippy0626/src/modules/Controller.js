import View from "./View.js";
import Model from "./Model.js";
import { QuantitativeHabit } from "./habit.js";

const Controller = {
  init() {
    Model.initStorage();
    this.bindHabitEvents();
    this.bindModalEvents();
  },

  bindHabitEvents() {
    Model.sortHabits("last-completed-newest");

    View.habit.displayHabits(Model.getAllHabits());

    View.scrollToThisMonth();

    View.onAddHabitBtnClick(() => {
      View.addHabitModal.clear();
      View.addHabitModal.show();
    });

    View.habit.onHabitCardClick((event) => {
      // Differentiate between a clicked date vs. edit habit
      const element = event.target;
      if (element.classList.contains("edit-icon")) {
        const habitName = event.target.closest(".habit-card").dataset.habitName;
        const habit = Model.getHabit(habitName);
        View.editHabitModal.updateFormView(habit);
        View.editHabitModal.show();
      } else if (element.classList.contains("date-box")) {
        const dateData = View.habit.getClickedDateData(element);
        if (dateData) {
          const habit = Model.getHabit(dateData.habitName);
          View.logModal.updateFormView(dateData, habit);
          View.logModal.show();
        }
      }
    });
  },

  bindModalEvents() {
    View.onModalOverlayClick(() => {
      View.addHabitModal.clear();
      View.addHabitModal.hide();
      View.logModal.clear();
      View.logModal.hide();
      View.editHabitModal.clear();
      View.editHabitModal.hide();
      View.confirmModal.clear();
      View.confirmModal.hide();
      View.scrollToThisMonth();
    });

    // --- Add Habit Modal Event Listeners ---
    View.addHabitModal.onSubmitClick((event) => {
      event.preventDefault();
      View.addHabitModal.hide();

      const data = View.addHabitModal.getFormData();
      const habit = Model.createHabit(data.habitName, data.habitDesc, data.habitQuantityFormat, data.habitCategory);
      Model.setHabit(habit);

      View.habit.displayHabits(Model.getAllHabits());
      View.scrollToThisMonth();
    });

    View.addHabitModal.onCancelClick(() => {
      View.addHabitModal.clear();
      View.addHabitModal.hide();
      View.scrollToThisMonth();
    });

    View.addHabitModal.onHabitTypeClick((event) => {
      let element = event.target;
      if (element.value === "number") {
        View.addHabitModal.showHabitQuantityFormat();
      } else {
        View.addHabitModal.hideHabitQuantityFormat();
      }
    });

    // --- Log Habit Modal Event Listeners ---
    View.logModal.onSubmitClick((event) => {
      event.preventDefault();
      const data = View.logModal.getFormData();
      // {completed: 'false', quantity: '0', notes: '', accessDate: '2025-03-09', habitName: 'Running'}
      const habit = Model.getHabit(data.habitName);
      if (habit instanceof QuantitativeHabit) {
        habit.changeQuantityOnDate(data.accessDate, data.quantity);
        habit.changeCompletionOnDate(data.accessDate, data.completed);
        habit.changeNotesOnDate(data.accessDate, data.notes);
      } else {
        habit.changeCompletionOnDate(data.accessDate, data.completed);
        habit.changeNotesOnDate(data.accessDate, data.notes);
      }
      Model.setHabit(habit);

      View.logModal.clear();
      View.logModal.hide();

      View.habit.displayHabits(Model.getAllHabits());

      // for scrolling effect after you log a habit
      View.scrollToThisMonth()
      let y, m, d;
      [y, m, d] = data.accessDate.split("-");
      View.scrollToMonthForHabit(Number(m) - 1, data.habitName);
    });

    View.logModal.onCancelClick(() => {
      View.logModal.clear();
      View.logModal.hide();
    });

    // --- Edit Habit Modal Event Listeners ---
    View.editHabitModal.onSubmitClick((event) => {
      event.preventDefault();
      const data = View.editHabitModal.getFormData();
      const habit = Model.getHabit(data.oldHabitName);

      // Handle habit name changes
      if (data.editedName !== data.oldHabitName) {
        Model.deleteHabit(data.oldHabitName);
        if (!(habit instanceof QuantitativeHabit)) {
          // bool habit
          habit.name = data.editedName;
          habit.category = data.editedCategory;
          habit.description = data.editedDesc;
        } else {
          habit.name = data.editedName;
          habit.quantityFormat = data.editedFormat;
          habit.category = data.editedCategory;
          habit.description = data.editedDesc;
        }
      } else {
        // Habit Name didn't change
        if (!(habit instanceof QuantitativeHabit)) {
          // bool habit
          habit.category = data.editedCategory;
          habit.description = data.editedDesc;
        } else {
          habit.quantityFormat = data.editedFormat;
          habit.category = data.editedCategory;
          habit.description = data.editedDesc;
        }
      }
      Model.setHabit(habit);
      View.editHabitModal.hide();
      View.editHabitModal.clear();

      View.habit.displayHabits(Model.getAllHabits());
      View.scrollToThisMonth();
    });

    View.editHabitModal.onCancelClick(() => {
      View.editHabitModal.hide();
      View.scrollToThisMonth();
    });

    View.editHabitModal.onDeleteClick(() => {
      View.editHabitModal.clear();
      View.editHabitModal.hide();

      View.confirmModal.clear();
      const habit = Model.getHabit(View.query(".edit-habit-form").dataset.oldHabitName);
      View.confirmModal.updateFormView(habit);
      View.confirmModal.show();
    });

    // --- Confirm Modal Event Listeners ---
    View.confirmModal.onSubmitClick((event) => {
      event.preventDefault();
      const confirmName = View.confirmModal.getFormData();
      const habitToDelete = Model.getHabit(View.query(".edit-habit-form").dataset.oldHabitName);
      if (confirmName !== habitToDelete.name) {
        View.confirmModal.showInvalidInputMsg();
      } else {
        View.confirmModal.hideInvalidInputMsg();
        Model.deleteHabit(habitToDelete.name);
        View.confirmModal.hide();
        View.confirmModal.clear();
        View.habit.displayHabits(Model.getAllHabits());
        View.scrollToThisMonth();
      }
    });

    View.confirmModal.onCancelClick(() => {
      View.confirmModal.hide();
      View.scrollToThisMonth();
    });
  },
};

export default Controller;
