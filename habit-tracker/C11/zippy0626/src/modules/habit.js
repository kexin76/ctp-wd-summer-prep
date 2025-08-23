import { format } from "date-fns";

class QuantitativeHabit {
  constructor(name, description, quantityFormat = undefined, category = undefined) {
    this.name = name;
    this.description = description;
    this.quantityFormat = quantityFormat;
    this.category = category;
    this.createdDate = format(new Date(), "yyyy-MM-dd");
    this.completionHistory = {};

    // Populate completion history
    let year = new Date().getFullYear();
    let date = new Date(year, 0, 1);
    let end = new Date(year, 11, 31);

    while (date <= end) {
      const dateStr = format(date, "yyyy-MM-dd");
      this.completionHistory[dateStr] = { completed: false, quantity: 0, notes: "" };
      date.setDate(date.getDate() + 1);
    }
  }

  // --- Getters ---

  getQuantityOnDate(date) {
    return this.completionHistory[date].quantity;
  }

  getCompletionOnDate(date) {
    return this.completionHistory[date].completed;
  }

  getNotesOnDate(date) {
    return this.completionHistory[date].notes;
  }

  getCurrentStreak() {
    let streak = 0;
    // yearIndex, monthIndex, dayIndex
    const firstDayOfYear = new Date(new Date().getFullYear(), 0, 1);
    const today = new Date();
    // loop thru days decrementing
    for (let day = new Date(today); day >= firstDayOfYear; day.setDate(day.getDate() - 1)) {
      let formattedDay = format(day, "yyyy-MM-dd");
      if (this.getCompletionOnDate(formattedDay) === true) {
        streak++;
      } else {
        return streak;
      }
    }

    return streak;
  }

  getLongestStreak() {
    let longestStreak = 0;
    let streak = 0;

    const firstDayOfYear = new Date(new Date().getFullYear(), 0, 1);
    const lastDayOfYear = new Date(new Date().getFullYear(), 11, 31);

    for (let day = new Date(lastDayOfYear); day >= firstDayOfYear; day.setDate(day.getDate() - 1)) {
      let formattedDay = format(day, "yyyy-MM-dd");
      if (this.getCompletionOnDate(formattedDay) === true) {
        streak++;
      } else {
        if (streak > longestStreak) longestStreak = streak;
        streak = 0; // reset
      }
    }

    // final check in case the streak goes until Jan 1
    if (streak > longestStreak) longestStreak = streak;

    return longestStreak;
  }

  getLastCompletedDate() {
    const firstDayOfYear = new Date(new Date().getFullYear(), 0, 1);
    const today = new Date();

    for (let day = new Date(today); day >= firstDayOfYear; day.setDate(day.getDate() - 1)) {
      let formattedDay = format(day, "yyyy-MM-dd");
      if (this.getCompletionOnDate(formattedDay) === true) {
        return formattedDay;
      }
    }

    return undefined;
  }

  getQuantityFormat() {
    return this.quantityFormat;
  }

  // --- Setters ---

  changeQuantityFormat(newFormat) {
    this.quantityFormat = newFormat;
  }

  changeQuantityOnDate(date, amount) {
    this.completionHistory[date].quantity = amount;
  }

  changeCompletionOnDate(date, status) {
    this.completionHistory[date].completed = status;
  }

  changeNotesOnDate(date, newNote) {
    this.completionHistory[date].notes = newNote;
  }
}

class BooleanHabit {
  constructor(name, description, category = undefined) {
    this.name = name;
    this.description = description;
    this.category = category;
    this.createdDate = format(new Date(), "yyyy-MM-dd");
    this.completionHistory = {};

    // Populate completion history
    let year = new Date().getFullYear();
    let date = new Date(year, 0, 1);
    let end = new Date(year, 11, 31);

    while (date <= end) {
      const dateStr = format(date, "yyyy-MM-dd");
      this.completionHistory[dateStr] = { completed: false, notes: "" };
      date.setDate(date.getDate() + 1);
    }
  }
  // --- Getters ---

  getCompletionOnDate(date) {
    return this.completionHistory[date].completed;
  }

  getNotesOnDate(date) {
    return this.completionHistory[date].notes;
  }

  getCurrentStreak() {
    let streak = 0;
    const firstDayOfYear = new Date(new Date().getFullYear(), 0, 1);
    const today = new Date();
    // loop thru days decrementing
    for (let day = new Date(today); day >= firstDayOfYear; day.setDate(day.getDate() - 1)) {
      let formattedDay = format(day, "yyyy-MM-dd");
      if (this.getCompletionOnDate(formattedDay) === true) {
        streak++;
      } else {
        return streak;
      }
    }
    return streak;
  }

  getLongestStreak() {
    let longestStreak = 0;
    let streak = 0;

    const firstDayOfYear = new Date(new Date().getFullYear(), 0, 1);
    const lastDayOfYear = new Date(new Date().getFullYear(), 11, 31);

    for (let day = new Date(lastDayOfYear); day >= firstDayOfYear; day.setDate(day.getDate() - 1)) {
      let formattedDay = format(day, "yyyy-MM-dd");
      if (this.getCompletionOnDate(formattedDay) === true) {
        streak++;
      } else {
        if (streak > longestStreak) longestStreak = streak;
        streak = 0; // reset
      }
    }

    // final check in case the streak goes until Jan 1
    if (streak > longestStreak) longestStreak = streak;

    return longestStreak;
  }

  getLastCompletedDate() {
    const firstDayOfYear = new Date(new Date().getFullYear(), 0, 1);
    const today = new Date();

    for (let day = new Date(today); day >= firstDayOfYear; day.setDate(day.getDate() - 1)) {
      let formattedDay = format(day, "yyyy-MM-dd");
      if (this.getCompletionOnDate(formattedDay) === true) {
        return formattedDay;
      }
    }

    return undefined;
  }

  // --- Setters ---

  changeCompletionOnDate(date, status) {
    this.completionHistory[date].completed = status;
  }

  changeNotesOnDate(date, newNote) {
    this.completionHistory[date].notes = newNote;
  }
}

export { QuantitativeHabit, BooleanHabit };
