// Task CRUD operations with localStorage

import { ReviewTask } from './model';

const STORAGE_KEY = 'katasensei_tasks_v1';

// Generate unique ID
const generateId = (): string => {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Get all tasks from localStorage
export const getTasks = (): ReviewTask[] => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error reading tasks:', error);
        return [];
    }
};

// Save tasks to localStorage
const saveTasks = (tasks: ReviewTask[]): void => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
        console.error('Error saving tasks:', error);
    }
};

// Get a single task by ID
export const getTask = (id: string): ReviewTask | undefined => {
    const tasks = getTasks();
    return tasks.find(t => t.id === id);
};

// Create a new task
export const createTask = (task: Omit<ReviewTask, 'id' | 'createdAt' | 'completed'>): ReviewTask => {
    const newTask: ReviewTask = {
        ...task,
        id: generateId(),
        createdAt: new Date().toISOString(),
        completed: false,
    };

    const tasks = getTasks();
    tasks.push(newTask);
    saveTasks(tasks);

    return newTask;
};

// Update an existing task
export const updateTask = (updatedTask: ReviewTask): void => {
    const tasks = getTasks();
    const index = tasks.findIndex(t => t.id === updatedTask.id);
    if (index !== -1) {
        tasks[index] = updatedTask;
        saveTasks(tasks);
    }
};

// Delete a task
export const deleteTask = (id: string): void => {
    const tasks = getTasks();
    const filtered = tasks.filter(t => t.id !== id);
    saveTasks(filtered);
};

// Mark task as completed
export const completeTask = (id: string): void => {
    const task = getTask(id);
    if (task) {
        updateTask({ ...task, completed: true });
    }
};

// Get tasks that are due (scheduledTime <= now) and not completed
export const getDueTasks = (): ReviewTask[] => {
    const now = new Date().toISOString();
    const tasks = getTasks();
    return tasks.filter(t => !t.completed && t.scheduledTime <= now);
};

// Get tasks grouped by status
export const getTasksGrouped = (): {
    overdue: ReviewTask[];
    today: ReviewTask[];
    upcoming: ReviewTask[];
    completed: ReviewTask[];
} => {
    const tasks = getTasks();
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const overdue: ReviewTask[] = [];
    const today: ReviewTask[] = [];
    const upcoming: ReviewTask[] = [];
    const completed: ReviewTask[] = [];

    tasks.forEach(task => {
        if (task.completed) {
            completed.push(task);
            return;
        }

        const scheduledTime = new Date(task.scheduledTime);

        if (scheduledTime < todayStart) {
            overdue.push(task);
        } else if (scheduledTime >= todayStart && scheduledTime < todayEnd) {
            today.push(task);
        } else {
            upcoming.push(task);
        }
    });

    // Sort each group by scheduled time
    const sortByTime = (a: ReviewTask, b: ReviewTask) =>
        new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime();

    overdue.sort(sortByTime);
    today.sort(sortByTime);
    upcoming.sort(sortByTime);
    completed.sort((a, b) =>
        new Date(b.scheduledTime).getTime() - new Date(a.scheduledTime).getTime()
    );

    return { overdue, today, upcoming, completed };
};

// Get count of pending tasks (overdue + today's due)
export const getPendingTaskCount = (): number => {
    const { overdue, today } = getTasksGrouped();
    const now = new Date().toISOString();
    const todayDue = today.filter(t => t.scheduledTime <= now);
    return overdue.length + todayDue.length;
};
