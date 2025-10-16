$(function() {
    let taskId = 0;
    let taskData = [];

    function loadTasks() {
        const saved = localStorage.getItem('taskData');
        if (saved) {
            taskData = JSON.parse(saved);
            taskId = taskData.length ? Math.max(...taskData.map(t => t.id)) + 1 : 0;
        }
    }
    function saveTasks() {
        localStorage.setItem('taskData', JSON.stringify(taskData));
    }
    function renderTasks(filter = "") {
        const $taskList = $('#task-list');
        $taskList.empty();
        let list = taskData.slice().sort((a,b) => a.completed === b.completed ? a.id-b.id : a.completed-b.completed);
        if (filter) list = list.filter(t => t.text.toLowerCase().includes(filter));
        list.forEach(task => {
            $taskList.append(`
                <div class="flex justify-between border-[0] rounded-[10px] text-[var(--color-font)] items-center h-[76px] bg-[var(--color-item)] dark:bg-purple-black dark:text-white mt-[20px] transition-all duration-500 sm:w-full group${task.removing ? ' removing' : ''}" data-id="${task.id}" id="task-item-${task.id}">
                  <div class="ml-[20px]">
                    <span id="task-text-${task.id}" class="h-[100%] max-w-[200px] break-all transition-[text-decoration] duration-400${task.completed ?  'completed line-through text-green' : ''}"  contenteditable="false">${$('<div>').text(task.text).html()}</span>
                  </div>
                  <div class="mobile:mr-[5px] flex justify-center items-center mr-[30px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 sm:mr-1.5">
                    <input id="task-checkbox-${task.id}" class="mobile:w-[20px] mobile:h-[20px] mobile:text-[0.7em] w-7 dark:accent-purple-light  h-7 ml-[10px] mr-[10px] accent-[var(--color-btn-bg)]" type="checkbox" ${task.completed ? 'checked' : ''}>
                    <button id="del-btn-${task.id}" class="mobile:w-[20px] mobile:h-[20px] text-[0.9em] dark:bg-purple-light dark:text-black w-7 h-7 bg-[var(--color-btn-bg)] text-[var(--color-btn-img)] rounded-[5px] border-0 sm:w-5 sm:h-5 sm:text-[0.7em]" title="Delete"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10 12L14 16M14 12L10 16M18 6L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg></button>
                  </div>
                </div>
            `);
        });
    }

    loadTasks();
    renderTasks();

    // Модальное окно открыть
    $('#open-modal-btn').on('click', function() {
        $('#modal-window').fadeIn(200);
        $('#modal-task-input').val('').focus();
    });
    // Модальное окно закрыть
    $('#modal-task-cancel').on('click', function() {
        $('#modal-window').fadeOut(200);
    });

    // Добавить задачу
    $('#modal-task-form').on('submit', function(e) {
        e.preventDefault();
        const text = $('#modal-task-input').val().trim();
        if (!text) return;
        taskData.unshift({id: taskId, text: text, completed: false});
        taskId++;
        saveTasks();
        renderTasks();
        $('#modal-window').fadeOut(200);
        $('#modal-task-input').val('');
    });

    // Редактирование задачи через id
    $(document).on('dblclick', '[id^="task-text-"]', function() {
        $(this).attr("contentEditable", true).focus();
    });
    $(document).on('blur', '[id^="task-text-"]', function() {
        $(this).attr("contentEditable", false);
        const id = +$(this).closest('.task-item').data("id");
        const t = taskData.find(t => t.id === id);
        if (t) {
            t.text = $(this).text();
            saveTasks();
        }
    });
    $(document).on('keydown', '[id^="task-text-"][contenteditable="true"]', function(e) {
        if (e.key === "Enter") {
            e.preventDefault();
            $(this).blur();
        }
    });

    // Выполненная задача
    $(document).on('change', '[id^="task-checkbox-"]', function() {
    const id = +$(this).closest('[data-id]').data("id");
    const t = taskData.find(t => t.id === id);
    if (t) {
        t.completed = this.checked;
        saveTasks();

        const $text = $('#task-text-' + id);

        if (t.completed) {
            $text.addClass('line-through text-green');
        } else {
            $text.removeClass('line-through text-green');
        }
        renderTasks()
    }
});



    // Удаление
    $(document).on('click', '[id^="del-btn-"]', function() {
    const id = +$(this).closest('[data-id]').data("id");
    if (confirm("Точно хотите удалить задачу?")) {
        taskData = taskData.filter(t => t.id !== id);
        saveTasks();
        $(`#task-item-${id}`).addClass("removing");
        setTimeout(() => renderTasks(), 400);
    }
});

    // Поиск
    $('#search-task-input').on('input', function() {
        renderTasks($(this).val().toLowerCase());
    });

    if(localStorage.getItem('theme') === 'dark') {
        $('html').addClass('dark');
    }

    // Смена темы
    $('#theme-toggle').on('click', function() {
        $('html').toggleClass('dark');
        if ($('html').hasClass('dark')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });
});
