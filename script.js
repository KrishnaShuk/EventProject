// Wait for the page to fully load
document.addEventListener('DOMContentLoaded', function() {
    // -------------------------------------------
    // SELECT ELEMENTS FROM THE DOM
    // -------------------------------------------
    const taskInput = document.getElementById('task-input');
    const taskCategory = document.getElementById('task-category');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const taskCounter = document.getElementById('task-counter');
    const emptyState = document.getElementById('empty-state');
    const clearAllBtn = document.getElementById('clear-all-btn');

    // -------------------------------------------
    // TASKS ARRAY - STORES ALL TASKS
    // -------------------------------------------
    let tasks = [];
    // -------------------------------------------
    // FUNCTIONS
    // -------------------------------------------

    // Function to save tasks to localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Function to load tasks from localStorage
    function loadTasks() {
        // Try to get tasks from localStorage
        const savedTasks = localStorage.getItem('tasks');

        // If tasks were found in localStorage
        if (savedTasks) {
            // Convert the JSON string back to a JavaScript array
            tasks = JSON.parse(savedTasks);

            // Display the tasks
            displayTasks();
        }
    }

    // Function to add a new task
    function addTask() {
        // Get task text and remove extra spaces
        const taskText = taskInput.value.trim();

        // If input is empty, don't add the task
        if (taskText === '') {
            alert('Please enter a task!');
            return;
        }

        // Create a new task object
        const newTask = {
            id: Date.now(),  // Use timestamp as a unique ID
            text: taskText,
            category: taskCategory.value,
            completed: false
        };

        // Add the task to our array
        tasks.push(newTask);

        // Save tasks to localStorage
        saveTasks();

        // Clear the input field
        taskInput.value = '';

        // Update the display
        displayTasks();
    }

    // Function to toggle the completed status of a task
    function toggleTaskComplete(taskId) {
        // Find the task with the given ID
        const taskIndex = tasks.findIndex(task => task.id === taskId);

        // If found, toggle its completed status
        if (taskIndex !== -1) {
            tasks[taskIndex].completed = !tasks[taskIndex].completed;

            // Save the updated tasks
            saveTasks();

            // Update the display
            displayTasks();
        }
    }

    // Function to delete a task
    function deleteTask(taskId) {
        // Remove the task with the given ID
        tasks = tasks.filter(task => task.id !== taskId);

        // Save the updated tasks
        saveTasks();

        // Update the display
        displayTasks();
    }

    // Function to clear all tasks
    function clearAllTasks() {
        // Confirm with the user
        const confirmDelete = confirm('Are you sure you want to delete all tasks?');

        if (confirmDelete) {
            // Clear the tasks array
            tasks = [];

            // Save the empty array
            saveTasks();

            // Update the display
            displayTasks();
        }
    }

    // Function to display all tasks
    function displayTasks() {
        // Clear the current list
        taskList.innerHTML = '';

        // Update the task counter
        taskCounter.textContent = `(${tasks.length})`;

        // Show empty state if no tasks
        if (tasks.length === 0) {
            emptyState.classList.add('visible');
        } else {
            emptyState.classList.remove('visible');
        }

        // Loop through each task and create an HTML element for it
        tasks.forEach(function(task) {
            // Create a list item
            const taskItem = document.createElement('li');
            taskItem.className = 'task-item';
            if (task.completed) {
                taskItem.classList.add('completed');
            }

            // Create the task content
            const taskContent = document.createElement('div');
            taskContent.className = 'task-content';

            // Create the checkbox
            const checkbox = document.createElement('span');
            checkbox.className = 'task-checkbox';
            checkbox.innerHTML = task.completed ? 
                '<i class="fas fa-check-circle"></i>' : 
                '<i class="far fa-circle"></i>';
            checkbox.addEventListener('click', function() {
                toggleTaskComplete(task.id);
            });

            // Create the task text
            const taskText = document.createElement('span');
            taskText.className = 'task-text';
            taskText.textContent = task.text;

            // Create the category badge
            const categoryBadge = document.createElement('span');
            categoryBadge.className = `task-category category-${task.category}`;
            categoryBadge.textContent = task.category;

            // Create the delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
            deleteBtn.addEventListener('click', function() {
                deleteTask(task.id);
            });

            // Assemble the task item
            taskContent.appendChild(checkbox);
            taskContent.appendChild(taskText);
            taskContent.appendChild(categoryBadge);
            taskItem.appendChild(taskContent);
            taskItem.appendChild(deleteBtn);

            // Add the task item to the list
            taskList.appendChild(taskItem);
        });
    }

    // -------------------------------------------
    // EVENT LISTENERS
    // -------------------------------------------

    // Add a task when the button is clicked
    addTaskBtn.addEventListener('click', addTask);

    // Add a task when Enter key is pressed in the input field
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // Clear all tasks when the clear button is clicked
    clearAllBtn.addEventListener('click', clearAllTasks);

    // -------------------------------------------
    // INITIALIZE THE APP
    // -------------------------------------------

    // Load tasks when the page loads
    loadTasks();
});