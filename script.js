function showRegister() {
    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("registerPage").classList.remove("hidden");
}

function showLogin() {
    document.getElementById("registerPage").classList.add("hidden");
    document.getElementById("loginPage").classList.remove("hidden");
}

function register() {
    const username = document.getElementById("regUsername").value;
    const contact = document.getElementById("regContact").value;
    const password = document.getElementById("regPassword").value;

    if (!username || !contact || !password) {
        alert("Please fill all fields!");
        return;
    }

    localStorage.setItem("username", username);
    localStorage.setItem("contact", contact);
    localStorage.setItem("password", password);

    alert("Registration successful! Please login now.");
    showLogin();
}

function login() {
    const contact = document.getElementById("loginContact").value;
    const password = document.getElementById("loginPassword").value;

    const storedContact = localStorage.getItem("contact");
    const storedPass = localStorage.getItem("password");

    if (contact === storedContact && password === storedPass) {
        document.getElementById("loginPage").classList.add("hidden");
        document.getElementById("dashboard").classList.remove("hidden");
    } else {
        alert("Invalid login! Please register first.");
    }
}

const holidays = ["2025-09-14", "2025-09-20"];
const subjectsList = ["Math", "Science", "English", "History", "Geography", "Physics", "Biology"];
const morningStart = "08:00";
const eveningStart = "14:00";
const endOfDay = "18:00";

function generateTimetable() {
    const numClasses = parseInt(document.getElementById('numClasses').value);
    const numSections = parseInt(document.getElementById('numSections').value);
    const numSubjects = parseInt(document.getElementById('numSubjects').value);
    const hoursPerDay = parseInt(document.getElementById('hoursPerDay').value);
    const numClassrooms = parseInt(document.getElementById('numClassrooms').value);
    const morningDuration = parseInt(document.getElementById('morningDuration').value);
    const eveningDuration = parseInt(document.getElementById('eveningDuration').value);

    const today = new Date();
    const daysToGenerate = 7;
    const timetable = {};

    for (let c = 1; c <= numClasses; c++) {
        for (let s = 1; s <= numSections; s++) {
            const sectionId = `Class ${c} - Section ${String.fromCharCode(64 + s)}`;
            timetable[sectionId] = [];

            let currentDate = new Date(today);

            for (let d = 0; d < daysToGenerate; d++) {
                const dateStr = currentDate.toISOString().split('T')[0];

                const isHoliday = holidays.includes(dateStr);
                if (isHoliday || currentDate.getDay() === 0) {
                    timetable[sectionId].push({ date: dateStr, slots: "Holiday" });
                } else {
                    const slots = [];
                    let usedSubjects = [];
                    const isMorningShift = Math.random() < 0.5;
                    let timeSlotStart = isMorningShift ? morningStart : eveningStart;
                    const sessionDuration = isMorningShift ? morningDuration : eveningDuration;

                    for (let h = 0; h < sessionDuration; h++) {
                        let subject;
                        do {
                            subject = subjectsList[Math.floor(Math.random() * numSubjects)];
                        } while (usedSubjects.includes(subject) && usedSubjects.length < numSubjects);

                        usedSubjects.push(subject);
                        slots.push({ time: timeSlotStart, subject });
                        timeSlotStart = incrementTime(timeSlotStart, 1);
                    }

                    timetable[sectionId].push({ date: dateStr, slots });
                }

                currentDate.setDate(currentDate.getDate() + 1);
            }
        }
    }

    displayTimetable(timetable);
    document.getElementById("dashboard").classList.add("hidden");
    document.getElementById("timetablePage").classList.remove("hidden");
}

function incrementTime(time, duration) {
    const [hours, minutes] = time.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + duration * 60;
    const newHours = Math.floor(totalMinutes / 60);
    const newMinutes = totalMinutes % 60;

    const formattedTime = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
    return formattedTime > endOfDay ? endOfDay : formattedTime;
}

function displayTimetable(timetable) {
    const container = document.getElementById("timetable");
    container.innerHTML = "";

    for (const section in timetable) {
        const schedule = timetable[section];

        const table = document.createElement("table");

        const caption = document.createElement("caption");
        caption.textContent = `Timetable for ${section}`;
        table.appendChild(caption);

        const headerRow = document.createElement("tr");
        headerRow.innerHTML = `
            <th>Date</th>
            <th>Time</th>
            <th>Subject</th>
        `;
        table.appendChild(headerRow);

        schedule.forEach(day => {
            if (day.slots === "Holiday") {
                const row = document.createElement("tr");
                row.classList.add("holiday");

                const dateCell = document.createElement("td");
                dateCell.textContent = day.date;

                const holidayCell = document.createElement("td");
                holidayCell.colSpan = 2;
                holidayCell.textContent = "Holiday";

                row.appendChild(dateCell);
                row.appendChild(holidayCell);
                table.appendChild(row);
            } else {
                day.slots.forEach((slot, index) => {
                    const row = document.createElement("tr");

                    const dateCell = document.createElement("td");
                    dateCell.textContent = index === 0 ? day.date : "";

                    const timeCell = document.createElement("td");
                    timeCell.textContent = slot.time;

                    const subjectCell = document.createElement("td");
                    subjectCell.textContent = slot.subject;

                    row.appendChild(dateCell);
                    row.appendChild(timeCell);
                    row.appendChild(subjectCell);

                    table.appendChild(row);
                });
            }
        });

        container.appendChild(table);
    }
}

function backToDashboard() {
    document.getElementById("timetablePage").classList.add("hidden");
    document.getElementById("dashboard").classList.remove("hidden");
}
