import {createRouter, createWebHistory} from 'vue-router';
import Login from '../views/Login.vue';
import AppLayout from '@/layouts/AppLayout.vue';

const routes = [{path: '/', redirect: '/login'}, {path: '/login', name: 'Login', component: Login}, {
  path: '/',
  component: AppLayout,
  children: [{
    path: '/panel',
    name: 'Panel',
    component: () => import('../views/Panel.vue'),
    meta: {requiresAuth: true}
  }, {
    path: '/usuarios',
    name: 'Usuarios',
    component: () => import('../views/Usuarios.vue'),
    meta: {requiresAuth: true}
  }, {
    path: '/roles', name: 'Roles',
    component: () => import('../views/Roles.vue'),
    meta: {requiresAuth: true}
  },
    {
      path: '/civil-states',
      name: 'CivilStates',
      component: () => import('../views/CivilStates.vue'),
      meta: {requiresAuth: true}
    }, {
      path: '/enjoys', name: 'Enjoys',
      component: () => import('../views/Enjoys.vue'),
      meta: {requiresAuth: true}
    }, {
      path: '/experiences',
      name: 'Experiences',
      component: () => import('../views/Experiences.vue'),
      meta: {requiresAuth: true}
    }, {
      path: '/family', name: 'Family',
      component: () => import('../views/Family.vue'),
      meta: {requiresAuth: true}
    }, {
      path: '/gender', name: 'Gender',
      component: () => import('../views/Gender.vue'),
      meta: {requiresAuth: true}
    }, {
      path: '/interests',
      name: 'Interest',
      component: () => import('../views/Interest.vue'),
      meta: {requiresAuth: true}
    }, {
      path: '/lifestages',
      name: 'LifeStage',
      component: () => import('../views/LifeStage.vue'),
      meta: {requiresAuth: true}
    }, {
      path: '/needs', name: 'Needs',
      component: () => import('../views/Needs.vue'),
      meta: {requiresAuth: true}
    },
    {
      path: '/services',
      name: 'Services',
      component: () => import('../views/Services.vue'),
      meta: {requiresAuth: true}
    }, {
      path: '/social-media',
      name: 'SocialMedia',
      component: () => import('../views/SocialMedia.vue'),
      meta: {requiresAuth: true}
    }, {
      path: '/voluntary',
      name: 'Voluntary',
      component: () => import('../views/Voluntary.vue'),
      meta: {requiresAuth: true}
    }, {
      path: '/members',
      name: 'Members',
      component: () => import('@/views/Member.vue'),
      meta: {requiresAuth: true}
    }, {
      path: '/member-experiences',
      name: 'MemberExperiences',
      component: () => import('@/views/MemberExperiences.vue'),
      meta: {requiresAuth: true}
    }, {
      path: '/member-family',
      name: 'MemberFamily',
      component: () => import('@/views/MemberFamily.vue'),
      meta: {requiresAuth: true}
    }, {
      path: '/member-interests', name: 'MemberInterests',
      component: () => import('@/views/MemberInterest.vue'),
      meta: {requiresAuth: true}
    },
    {
      path: '/member-life-stages',
      name: 'MemberLifeStages',
      component: () => import('@/views/MemberLifeStage.vue'),
      meta: {requiresAuth: true}
    },
    {
      path: '/member-needs',
      name: 'MemberNeeds',
      component: () => import('@/views/MemberNeed.vue'),
      meta: {requiresAuth: true}
    },
    {
      path: '/member-services',
      name: 'MemberServices',
      component: () => import('@/views/MemberServices.vue'),
      meta: {requiresAuth: true}
    },
    {
      path: '/member-social-medias',
      name: 'MemberSocialMedia',
      component: () => import('@/views/MemberSocialMedias.vue'),
      meta: {requiresAuth: true}
    },
    {
      path: '/member-voluntary',
      name: 'MemberVoluntary',
      component: () => import('@/views/MemberVoluntary.vue'),
      meta: {requiresAuth: true}
    },
    {
      path: '/countries',
      name: 'Country',
      component: () => import('@/views/Countries.vue'),
      meta: {requiresAuth: true}
    },
    {
      path: '/states',
      name: 'States',
      component: () => import('@/views/States.vue'),
      meta: {requiresAuth: true}
    },
    {
      path: '/test-stats',
      name: 'TestStats',
      component: () => import('@/views/TestStats.vue'),
      meta: {requiresAuth: true}
    },
    {
      path: '/members/:id',
      name: 'MemberShow',
      component: () => import('@/views/MemberShow.vue'),
      meta: {requiresAuth: true}
    },
    {
      path: '/logs',
      name: 'ApiLogs',
      component: () => import('@/views/ApiLogs.vue'),
      meta: {requiresAuth: true}
    }


  ],
},];

const router = createRouter({
  history: createWebHistory(), routes,
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
