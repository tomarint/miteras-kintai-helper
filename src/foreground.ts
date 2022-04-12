(function () {
  'use strict';
  const messageName = "miteras-kintai-helper-message";
  function isNumeric(c: string): boolean {
    return c >= '0' && c <= '9';
  }
  function hhmm(minute: number): string {
    const m = minute % 60;
    const h = (minute - m) / 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }
  function enterTextToInput(input: HTMLInputElement | null, text: string): void {
    if (input == null) {
      return;
    }
    input.focus();
    /*
    function keydownHandler(this: HTMLInputElement, ev: KeyboardEvent) {
      if (ev.key === "Delete") {
        //ev.preventDefault();
        this.value = "";
      } else {
        this.value += ev.key;
      }
    };
    input.addEventListener("keydown", keydownHandler);
    for (let i = 0; i < 5; i++) {
      input.dispatchEvent(new KeyboardEvent("keydown", { key: "Delete" }));
    }
    for (const ch of text) {
      input.dispatchEvent(new KeyboardEvent("keydown", { key: ch }));
    }
    input.removeEventListener("keydown", keydownHandler);
    */
    input.value = text;
    // console.log(`enterTextToInput: ${text}`);
  }

  function messageHandler(lunchTime: number): void {
    const inputSelector: { [name: string]: string } = {
      workTimeIn: "#work-time-in",
      workTimeOut: "#work-time-out",
      breakTime1In: "#breaktime1 > td > input.formsTxtBox.formsTxtBox--time.break-time-input.time-input.work-time-in",
      breakTime1Out: "#breaktime1 > td > input.formsTxtBox.formsTxtBox--time.break-time-input.time-input.work-time-out",
      breakTime2In: "#breaktime2 > td > input.formsTxtBox.formsTxtBox--time.break-time-input.time-input.work-time-in",
      breakTime2Out: "#breaktime2 > td > input.formsTxtBox.formsTxtBox--time.break-time-input.time-input.work-time-out",
      breakTime3In: "#breaktime3 > td > input.formsTxtBox.formsTxtBox--time.break-time-input.time-input.work-time-in",
      breakTime3Out: "#breaktime3 > td > input.formsTxtBox.formsTxtBox--time.break-time-input.time-input.work-time-out",
      // breakTime4In: "#breaktime4 > td > input.formsTxtBox.formsTxtBox--time.break-time-input.time-input.work-time-in",
      // breakTime4Out: "#breaktime4 > td > input.formsTxtBox.formsTxtBox--time.break-time-input.time-input.work-time-out",
      // breakTime5In: "#breaktime5 > td > input.formsTxtBox.formsTxtBox--time.break-time-input.time-input.work-time-in",
      // breakTime5Out: "#breaktime5 > td > input.formsTxtBox.formsTxtBox--time.break-time-input.time-input.work-time-out",
    };
    let input: { [name: string]: HTMLInputElement | null } = {};
    Object.entries(inputSelector).forEach(([key, value]) => {
      input[key] = document.querySelector<HTMLInputElement>(value);
    });

    const workTimeIn = input["workTimeIn"]?.value;
    const workTimeOut = input["workTimeOut"]?.value;
    if (workTimeIn == null || workTimeOut == null) {
      return;
    }
    // console.log(`勤務時間: ${workTimeIn} - ${workTimeOut}`)
    if (!isNumeric(workTimeIn[0])
      || !isNumeric(workTimeIn[1])
      || !isNumeric(workTimeIn[3])
      || !isNumeric(workTimeIn[4])
      || !isNumeric(workTimeOut[0])
      || !isNumeric(workTimeOut[1])
      || !isNumeric(workTimeOut[3])
      || !isNumeric(workTimeOut[4])) {
      return;
    }
    let hour = Number(workTimeIn.substring(0, 2));
    let minute = Number(workTimeIn.substring(3, 5));
    const workTimeInMinute = hour * 60 + minute;
    hour = Number(workTimeOut.substring(0, 2));
    minute = Number(workTimeOut.substring(3, 5));
    const workTimeOutMinute = hour * 60 + minute;
    const workTimeMinutes = workTimeOutMinute - workTimeInMinute;
    // console.log(`勤務時間: ${workTimeMinutes}分`);

    /*
    const buttonSelector: { [name: string]: string } = {
      breakTime1: "#breaktime1 > td > button",
      breakTime2: "#breaktime2 > td > button",
      breakTime3: "#breaktime3 > td > button",
      breakTime4: "#breaktime4 > td > button",
      breakTime5: "#breaktime5 > td > button",
    };
    let button: { [name: string]: HTMLElement | null } = {};
    Object.entries(buttonSelector).forEach(([key, value]) => {
      button[key] = document.querySelector<HTMLInputElement>(value);
    });
    const breakTimeButtons: string[] = [
      "breakTime5",
      "breakTime4",
      "breakTime3",
      "breakTime2",
      "breakTime1",
    ];
    breakTimeButtons.forEach((key) => {
      if (button[key] != null) {
        if (button[key]?.hidden != true) {
          //button[key]?.dispatchEvent(new window.MouseEvent("click"));
          //button[key]?.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
          console.log(`Clicked ${key} button.`);
        }
      }
    });
    */

    //
    // Break time 1
    //
    let elaspedTime = 6 * 60;
    let breakTimeMinutes = workTimeMinutes - elaspedTime;
    breakTimeMinutes = Math.max(breakTimeMinutes, 0);
    breakTimeMinutes = Math.min(breakTimeMinutes, 45);
    if (breakTimeMinutes > 0) {
      // console.log("lunchTime", lunchTime);
      const breakTimeInMinute = Math.max(lunchTime, workTimeInMinute + 1);
      const breakTimeOutMinute = breakTimeInMinute + breakTimeMinutes;
      enterTextToInput(input["breakTime1In"], hhmm(breakTimeInMinute));
      enterTextToInput(input["breakTime1Out"], hhmm(breakTimeOutMinute));
    }

    //
    // Break time 2
    //
    elaspedTime = 8 * 60 + 45;
    breakTimeMinutes = workTimeMinutes - elaspedTime;
    breakTimeMinutes = Math.max(breakTimeMinutes, 0);
    breakTimeMinutes = Math.min(breakTimeMinutes, 15);
    if (breakTimeMinutes > 0) {
      let breakTimeInMinute = workTimeInMinute + elaspedTime;
      let breakTimeOutMinute = breakTimeInMinute + breakTimeMinutes;
      if (workTimeOutMinute == breakTimeOutMinute) {
        breakTimeInMinute -= 1;
        breakTimeOutMinute -= 1;
      }
      enterTextToInput(input["breakTime2In"], hhmm(breakTimeInMinute));
      enterTextToInput(input["breakTime2Out"], hhmm(breakTimeOutMinute));
    }

    //
    // Break time 3
    //
    elaspedTime = 8 * 60 + 45 + 15 + 3 * 60;
    breakTimeMinutes = workTimeMinutes - elaspedTime;
    breakTimeMinutes = Math.max(breakTimeMinutes, 0);
    breakTimeMinutes = Math.min(breakTimeMinutes, 15);
    if (breakTimeMinutes > 0) {
      let breakTimeInMinute = workTimeInMinute + elaspedTime;
      let breakTimeOutMinute = breakTimeInMinute + breakTimeMinutes;
      if (workTimeOutMinute == breakTimeOutMinute) {
        breakTimeInMinute -= 1;
        breakTimeOutMinute -= 1;
      }
      enterTextToInput(input["breakTime3In"], hhmm(breakTimeInMinute));
      enterTextToInput(input["breakTime3Out"], hhmm(breakTimeOutMinute));
    }

    input["breakTime1In"]?.focus();
  }
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === messageName) {
      chrome.storage.sync.get({
        breaktime1: '720',
      }, function (items) {
        const lunchTime = Number(items.breaktime1);
        messageHandler(lunchTime);
        sendResponse({ message: "success" });
      });
      return true;
    }
  });
})();
