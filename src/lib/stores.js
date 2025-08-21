import { writable } from 'svelte/store';

export const user = writable(null);
export const showAuthModal = writable(false);
export const authMode = writable('login'); // 'login' or 'signup'
