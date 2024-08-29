document.getElementById('set-alarm').addEventListener('click', setAlarm);

let alarms = [];

function setAlarm() {
    const timeInput = document.getElementById('alarm-time').value;
    const difficulty = document.getElementById('difficulty').value;

    if (!timeInput) {
        alert('Please select a time for the alarm.');
        return;
    }

    const alarmTime = new Date();
    const [hours, minutes] = timeInput.split(':');
    alarmTime.setHours(hours, minutes, 0, 0);

    const now = new Date();
    const timeDifference = alarmTime.getTime() - now.getTime();

    if (timeDifference < 0) {
        alert('Please select a time in the future.');
        return;
    }

    const alarm = {
        time: timeInput,
        difficulty: difficulty,
        timeout: setTimeout(() => triggerAlarm(timeInput, difficulty), timeDifference)
    };

    alarms.push(alarm);
    displayAlarms();
}

function triggerAlarm(time, difficulty) {
    document.getElementById('math-modal').style.display = 'block';
    const mathQuestion = generateMathQuestion(difficulty);
    document.getElementById('math-question').innerText = mathQuestion.question;

    document.getElementById('submit-answer').onclick = function() {
        const userAnswer = document.getElementById('answer').value;
        if (parseInt(userAnswer) === mathQuestion.answer) {
            stopAlarm(time);
        } else {
            alert('Incorrect answer, try again.');
        }
    };

    document.getElementById('snooze-alarm').onclick = function() {
        snoozeAlarm(time, difficulty);
    };
}

function stopAlarm(time) {
    document.getElementById('math-modal').style.display = 'none';
    document.getElementById('alarm-status').innerText = '';
    alarms = alarms.filter(alarm => alarm.time !== time);
    displayAlarms();
}

function snoozeAlarm(time, difficulty) {
    const snoozeTime = 5 * 60 * 1000; // 5 minutes snooze
    document.getElementById('math-modal').style.display = 'none';

    const alarm = alarms.find(alarm => alarm.time === time);
    clearTimeout(alarm.timeout);

    alarm.timeout = setTimeout(() => triggerAlarm(time, difficulty), snoozeTime);
}

function displayAlarms() {
    const alarmList = document.getElementById('alarms');
    alarmList.innerHTML = '';
    alarms.forEach(alarm => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${alarm.time} (${alarm.difficulty})</span>
            <button onclick="deleteAlarm('${alarm.time}')">Delete</button>
        `;
        alarmList.appendChild(li);
    });
}

function deleteAlarm(time) {
    const alarm = alarms.find(alarm => alarm.time === time);
    clearTimeout(alarm.timeout);
    alarms = alarms.filter(alarm => alarm.time !== time);
    displayAlarms();
}

function generateMathQuestion(difficulty) {
    let num1, num2, question, answer;

    switch (difficulty) {
        case 'easy':
            num1 = Math.floor(Math.random() * 10) + 1;
            num2 = Math.floor(Math.random() * 10) + 1;
            question = `What is ${num1} + ${num2}?`;
            answer = num1 + num2;
            break;
        case 'medium':
            num1 = Math.floor(Math.random() * 50) + 1;
            num2 = Math.floor(Math.random() * 50) + 1;
            question = `What is ${num1} * ${num2}?`;
            answer = num1 * num2;
            break;
        case 'hard':
            num1 = Math.floor(Math.random() * 100) + 1;
            num2 = Math.floor(Math.random() * 10) + 1;
            question = `What is ${num1} / ${num2}? (Round to nearest whole number)`;
            answer = Math.round(num1 / num2);
            break;
        default:
            break;
    }

    return { question, answer };
}
