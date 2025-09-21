// Supabase configuration
const SUPABASE_URL = 'https://zmpqkqnfdhjjwdtoxedh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptcHFrcW5mZGhqandkdG94ZWRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NDI2MjMsImV4cCI6MjA3NDAxODYyM30.iG_UNl4BPHrFgnkSBwj4Ky2Bh6WCzt3Umgafl4q_QaY'; // Replace with your actual anon key

// Import Supabase client from CDN
import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js@2';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export for use in other files
window.supabase = supabase;

// Auth state management
let currentUser = null;

// Check authentication status
async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser();
    currentUser = user;
    updateAuthUI();
    return user;
}

// Update UI based on auth state
function updateAuthUI() {
    const authSection = document.getElementById('auth-section');
    const userSection = document.getElementById('user-section');
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const userEmail = document.getElementById('user-email');

    if (currentUser) {
        // User is logged in
        if (authSection) authSection.style.display = 'none';
        if (userSection) userSection.style.display = 'block';
        if (userEmail) userEmail.textContent = currentUser.email;
    } else {
        // User is not logged in
        if (authSection) authSection.style.display = 'block';
        if (userSection) userSection.style.display = 'none';
    }
}

// Sign up function
async function signUp(email, password, name) {
    try {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    name: name
                }
            }
        });

        if (error) throw error;

        alert('Pendaftaran berjaya! Sila semak email untuk pengesahan.');
        return { success: true, data };
    } catch (error) {
        console.error('Error signing up:', error);
        alert('Ralat: ' + error.message);
        return { success: false, error };
    }
}

// Sign in function
async function signIn(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) throw error;

        currentUser = data.user;
        updateAuthUI();
        alert('Log masuk berjaya!');
        return { success: true, data };
    } catch (error) {
        console.error('Error signing in:', error);
        alert('Ralat: ' + error.message);
        return { success: false, error };
    }
}

// Sign out function
async function signOut() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;

        currentUser = null;
        updateAuthUI();
        alert('Log keluar berjaya!');
        return { success: true };
    } catch (error) {
        console.error('Error signing out:', error);
        alert('Ralat: ' + error.message);
        return { success: false, error };
    }
}

// Submit comment function
async function submitComment(nama, komen) {
    if (!currentUser) {
        alert('Sila log masuk terlebih dahulu untuk menghantar komen.');
        return { success: false };
    }

    try {
        const { data, error } = await supabase
            .from('comments')
            .insert([
                {
                    user_id: currentUser.id,
                    nama: nama,
                    komen: komen
                }
            ])
            .select();

        if (error) throw error;

        alert('Komen berjaya dihantar!');
        return { success: true, data };
    } catch (error) {
        console.error('Error submitting comment:', error);
        alert('Ralat: ' + error.message);
        return { success: false, error };
    }
}

// Get all comments function
async function getComments() {
    try {
        const { data, error } = await supabase
            .from('comments')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Error fetching comments:', error);
        return { success: false, error };
    }
}

// Listen for auth changes
supabase.auth.onAuthStateChange((event, session) => {
    currentUser = session?.user || null;
    updateAuthUI();
});

// Export functions for global use
window.authFunctions = {
    checkAuth,
    signUp,
    signIn,
    signOut,
    submitComment,
    getComments,
    getCurrentUser: () => currentUser
};

// Initialize auth check when page loads
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
});