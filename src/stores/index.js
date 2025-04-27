import { createStore } from 'vuex';

const store = createStore({
    state() {
        return {
            user: null,
            token: null,
        };
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
        },
        setToken(state, token) {
            state.token = token;
        },
        logout(state) {
            state.user = null;
            state.token = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
    },
    actions: {
        saveSession({ commit }, { user, token }) {
            commit('setUser', user);
            commit('setToken', token);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
        },
        restoreSession({ commit }) {
            const token = localStorage.getItem('token');
            const user = JSON.parse(localStorage.getItem('user'));
            if (token && user) {
                commit('setToken', token);
                commit('setUser', user);
            }
        },
    },
});

export default store;
