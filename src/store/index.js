import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    draggedCard: {},
    mainCard: {},
    extraCard: {},
    sideCard: {},
    hoveredCard: {},
    allCards: [],
    dropout: false
  },
  mutations: {
    draggedCard(store, payload) {
      store.draggedCard = payload;
    },
    mainCard(store, payload) {
      store.mainCard = payload;
    },
    extraCard(store, payload) {
      store.extraCard = payload;
    },
    sideCard(store, payload) {
      store.sideCard = payload;
    },
    hoveredCard(store, payload) {
      store.hoveredCard = payload;
    },
    allCards(store, payload) {
      store.allCards = payload;
    },
    dropout(store, payload) {
      store.dropout = payload;
    }
  },
  actions: {
    draggedCard({ commit }, payload) {
      commit('draggedCard', payload);
    },
    mainDeckDraggedCard({ commit }, payload) {
      commit('mainCard', payload);
    },
    sideDeckDraggedCard({ commit }, payload) {
      commit('sideCard', payload);
    },
    extraDeckDraggedCard({ commit }, payload) {
      commit('extraCard', payload);
    },
    cardHover({ commit }, payload) {
      commit('hoveredCard', payload);
    },
    allCards({ commit }, payload) {
      commit('allCards', payload);
    },
    dropout({ commit }, payload) {
      commit('dropout', payload);
    }
  },
  getters: {
    draggedCard: store => store.draggedCard,
    mainCard: store => store.mainCard,
    extraCard: store => store.extraCard,
    sideCard: store => store.sideCard,
    hoveredCard: store => store.hoveredCard,
    allCards: store => store.allCards,
    dropout: store => store.dropout
  }
})
