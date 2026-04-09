<template>
  <div class="card" :class="{ 'sortable': sortable }" style="position:relative" :draggable="draggable"
    @dragstart=" draggable ? $emit('dragstart', $event, card) : undefined"
    @dragend="draggable ? $emit('dragend') : undefined" @mouseover="$emit('hover', card)">
    <div v-if="showLimit && limit" class="limit">
      <div>{{ limit }}</div>
    </div>
    <div v-if="showPoints && points" class="genesys_points">
      <div>{{ points }}</div>
    </div>
    <img class="card__img" :src="card.card_images[0].image_url_small" alt="card" />
  </div>
</template>

<script>
export default {
  name: "Card",
  props: {
    card: {
      type: Object,
      required: true,
    },
    draggable: {
      type: Boolean,
      default: true,
    },
    sortable: {
      type: Boolean,
      default: true,
    },
    showLimit: {
      type: Boolean,
      default: true,
    },
    showPoints: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    limit() {
      if (!this.card.banlist_info) return 0;
      switch (this.card.banlist_info.ban_tcg) {
        case "Limited":
          return 1;
        case "Semi-Limited":
          return 2;
        default:
          return 0;
      }
    },
    points() {
      if (!this.card.misc_info?.length) return 0;
      return this.card.misc_info[0].genesys_points;
    }
  }
}
</script>

<style scoped>
.limit {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
  max-width: 30px;
  max-height: 30px;
  aspect-ratio: 1 / 1;
  width: clamp(18px, 30%, 28px);
  color: white;
  background-color: black;
  border: 3px solid red;
  border-radius: 50%;
  font-weight: bold;
  font-size: clamp(12px, 1vw, 24px);
}


.card {
  padding: 1px;
  overflow: hidden;

  /* font-size for genesys_points */
  /* fallback for older browser versions */
  font-size: clamp(12px, 1.5vw, 30px);
  /* for newer browser versions */
  container-type: inline-size;
}

.card__img {
  width: 100%;
  height: 100%;
  display: block;
}

.genesys_points {
  position: absolute;
  bottom: 3px;
  right: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
  aspect-ratio: 1 / 1;
  width: 50%;
  color: white;
  background-color: black;
  border: 3px solid lightblue;
  border-radius: 50%;
  font-weight: bold;

  /* fallback for older browser versions */
  font-size: 0.5em;
  /* for newer browser versions */
  font-size: clamp(12px, 25cqw, 30px);
}
</style>