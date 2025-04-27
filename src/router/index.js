import {createRouter, createWebHistory} from 'vue-router';
import Login from '../views/Login.vue';
import Panel from '../views/Panel.vue';
import Usuarios from '../views/Usuarios.vue';
import Roles from '../views/Roles.vue';
import CivilStates from '../views/CivilStates.vue';
import Enjoys from '../views/Enjoys.vue';
import Experiences from '../views/Experiences.vue';
import Family from '../views/Family.vue';
import Gender from '../views/Gender.vue';
import Interest from '../views/Interest.vue';
import LifeStage from '../views/LifeStage.vue';
import Needs from '../views/Needs.vue';

import Layout from '../layouts/Layout.vue';

const routes = [
    {path: '/', redirect: '/login'},
    {path: '/login', name: 'Login', component: Login},
    {
        path: '/',
        component: Layout,
        children: [
            {path: '/panel', name: 'Panel', component: Panel, meta: {requiresAuth: true}},
            {path: '/usuarios', name: 'Usuarios', component: Usuarios, meta: {requiresAuth: true}},
            {path: '/roles', name: 'Roles', component: Roles, meta: {requiresAuth: true}},
            {path: '/civil-states', name: 'CivilStates', component: CivilStates, meta: {requiresAuth: true}},
            {path: 'enjoys', name: 'Enjoys', component: Enjoys, meta: {requiresAuth: true}},
            {path: 'experiences', name: 'Experiences', component: Experiences, meta: {requiresAuth: true}},
            {path: 'family', name: 'Family', component: Family, meta: {requiresAuth: true}},
            {path: 'gender', name: 'Gender', component: Gender, meta: {requiresAuth: true}},
            {path: 'interests', name: 'Interest', component: Interest, meta: {requiresAuth: true}},
            {path: 'lifestages', name: 'LifeStage', component: LifeStage, meta: {requiresAuth: true}},
            {path: 'needs', name: 'Needs', component: Needs, meta: {requiresAuth: true}},


        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');

    if (to.meta.requiresAuth && !token) {
        next('/login');
    } else if (to.path === '/login' && token) {
        next('/panel');
    } else {
        next();
    }
});

export default router;
