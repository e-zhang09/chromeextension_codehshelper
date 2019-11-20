console.info('content js loaded from extension');

let curHistory = [];
let counter_checkCount = 0;

let mutationObserverEventDummy = document.createElement("div");

//todo check if page has been loaded to next user

let interval_checkAvail = setInterval(() => {
    if(counter_checkCount > 10) clearInterval(interval_checkAvail);
    counter_checkCount ++;
    if (document.getElementById('max-points') != null) {

        MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

        let observer = new MutationObserver(function (mutations, observer) {
            // fired when a mutation occurs

            let event; // The custom event that will be created
            if (document.createEvent) {
                event = document.createEvent("HTMLEvents");
                event.initEvent("mutationobserved", true, true);
                event.eventName = "mutationobserved";
                mutationObserverEventDummy.dispatchEvent(event);
            } else {
                event = document.createEventObject();
                event.eventName = "mutationobserved";
                event.eventType = "mutationobserved";
                mutationObserverEventDummy.fireEvent("on" + event.eventType, event);
            }

            // console.log(mutations, observer);
            // ...
        });

// define what element should be observed by the observer
// and what types of mutations trigger the callback
        observer.observe(document, {
            subtree: true,
            characterData: true
            //...
        });

        function checkForPageUpdate() {
            return new Promise((resolve, reject) => {
                let retryCounter = 0;

                let myFunctionReference = function () {
                    setTimeout(function () {
                        resolve(1);
                    }, 100);
                };

                if (navigator.userAgent.toLowerCase().indexOf('msie') !== -1) {
                    mutationObserverEventDummy.attachEvent('onmutationobserved', myFunctionReference);
                } else {
                    mutationObserverEventDummy.addEventListener('mutationobserved', myFunctionReference, false);
                }

                setInterval(() => {
                    if (retryCounter >= 40) reject('retried too many times');
                    retryCounter++;
                }, 500)
            });
        }


        let containerElem = document.getElementById('max-points').parentElement;

        let exist = document.getElementById('main-btn-ddabd64960e52bf54ef4bc3999e3368ce09f2773') != null;

        document.getElementById('canned-responses-btn').style.display = 'none';
        document.getElementsByClassName('shortcut-btns-section')[0].style.display = 'none';
        document.getElementsByClassName('grade-btns')[0].style.display = 'none';

        if (!exist) {
            let button = document.createElement('button');
            button.innerHTML = "<div class='ld ld-ball ld-bounce'></div>SMART";
            button.classList.add('btn-main-extra-almost');
            button.classList.add('ld-ext-right');
            button.classList.remove('running');
            button.id = 'main-btn-ddabd64960e52bf54ef4bc3999e3368ce09f2773';
            button.onclick = async function (e) {
                button.classList.add('running');
                button.setAttribute('disabled', 'disabled');

                checkForPageUpdate().then(res => {
                    button.classList.remove('running');
                    button.removeAttribute('disabled');
                }).catch(err => {
                    console.error('page would not load.. possibly done w/ queue');
                });

                let needsWorkButton = document.getElementsByClassName('js-needs-work')[0];
                let fullPointsButton = document.getElementsByClassName('js-give-full-points')[0];

                let maxPointElem = document.getElementById('max-points');
                let maxPoints = maxPointElem.innerText;

                let feedback = document.getElementById('student-feedback').value.toString().trim();
                let curLink = document.getElementById('editor-link').href;
                let scoreGiven = maxPoints;
                let studentName = document.getElementById('student-name').innerText;
                let assignmentName = document.getElementById('assignment-name').innerText;

                if (feedback.length === 0) {
                    setTimeout(() => {
                        fullPointsButton.click();
                    }, 50)
                } else {
                    document.getElementById('grade-score-input').value = maxPoints - 1;
                    scoreGiven = maxPoints - 1;
                    if (needsWorkButton != null) {
                        setTimeout(() => {
                            needsWorkButton.click();
                        }, 50);
                    } else {
                        alert('extension broken');
                    }
                }

                let history_childContainer = createUserDisplay(studentName, feedback, curLink, scoreGiven, maxPoints, assignmentName);
                let history_obj = {
                    studentName: studentName,
                    feedback: feedback,
                    curLink: curLink,
                    scoreGiven: scoreGiven,
                    maxPoints: maxPoints,
                    assignmentName: assignmentName
                };

                curHistory.push(history_obj);
                if (curHistory.length > 5) {
                    curHistory.shift();
                }
                chrome.storage.sync.set({'history_items': curHistory}, function () {
                    console.log('History saved');
                });

                if (historyList.childElementCount === 0) {
                    historyList.appendChild(history_childContainer);
                } else {
                    historyList.insertBefore(history_childContainer, historyList.childNodes[0]);
                }
            };
            containerElem.appendChild(button);

            let historyList = document.createElement('ul');
            historyList.id = 'ul-history-70c881d4a26984ddce795f6f71817c9cf4480e79';
            historyList.style.margin = '0';

            let listIndicator = document.createElement('p');
            listIndicator.innerText = 'GRADED PREVIOUSLY';
            listIndicator.style.padding = '6px 12px';
            listIndicator.style.margin = '0';
            listIndicator.style.color = 'white';
            listIndicator.style.backgroundColor = '#28384a';
            listIndicator.style.textAlign = 'center';
            listIndicator.style.borderRadius = '4px';
            listIndicator.style.fontWeight = '200';

            let messagesContainer = document.getElementsByClassName('messages')[0];
            messagesContainer.insertBefore(historyList, messagesContainer.firstChild);
            messagesContainer.insertBefore(listIndicator, messagesContainer.firstChild);

            chrome.storage.sync.get(['history_items'], function (items) {
                console.info('history retrieved', items);
                items.history_items.reverse();
                console.info(items.history_items.forEach(obj => {
                    historyList.appendChild(createUserDisplay(obj.studentName, obj.feedback, obj.curLink, obj.scoreGiven, obj.maxPoints, obj.assignmentName))
                }))
            });
        }

        let createUserDisplay = (studentName, feedback, curLink, scoreGiven, maxPoints, assignmentName) => {
            let history_childContainer = document.createElement('li');
            history_childContainer.style.display = 'flex';
            history_childContainer.style.flexDirection = 'column';
            history_childContainer.classList.add('ul-history-children-item');

            let history_studentNameDisplay = document.createElement('a');
            history_studentNameDisplay.innerText = studentName;
            history_studentNameDisplay.href = curLink;
            history_studentNameDisplay.target = '_blank';

            let history_assignmentNameDisplay = document.createElement("i");
            history_assignmentNameDisplay.innerText = assignmentName;
            history_assignmentNameDisplay.style.margin = '0';

            let history_scoreDisplay = document.createElement('p');
            history_scoreDisplay.style.margin = '0';
            history_scoreDisplay.innerText = 'Score: ' + scoreGiven + ' / ' + maxPoints;

            let history_feedbackDisplay = document.createElement('p');
            history_feedbackDisplay.style.margin = '0';
            let toggleBoolean_feedbackOverflow = feedback.length > 50;
            if (toggleBoolean_feedbackOverflow) {
                history_feedbackDisplay.innerText = 'Feedback: ' + feedback.substr(0, 50) + '...';
            } else {
                if (feedback.length === 0) {
                    history_feedbackDisplay.innerHTML = 'Feedback: <i>None</i>';
                } else {
                    history_feedbackDisplay.innerText = 'Feedback: ' + feedback;
                }
            }

            history_childContainer.append(history_studentNameDisplay, history_assignmentNameDisplay, history_scoreDisplay, history_feedbackDisplay);
            return history_childContainer;
        };
        clearInterval(interval_checkAvail);
    }
}, 500);