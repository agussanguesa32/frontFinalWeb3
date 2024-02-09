<template>
  <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
    <div class="carousel-indicators">
      <button v-for="(image, index) in images" :key="image.id" type="button" :data-bs-target="'#carouselExampleIndicators'" :data-bs-slide-to="index" :class="{ 'active': index === 0 }"></button>
    </div>
    <div class="carousel-inner">
      <div v-for="(image, index) in images" :key="image.id" class="carousel-item" :class="{ 'active': index === 0 }">
        <img :src="image.src" class="d-block w-100 carousel-image" alt="...">
      </div>
    </div>
    <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      images: [
        {
          id: 1,
          src: `https://www.busesycamioneschevrolet.com.co/wp-content/uploads/2022/02/banner-camiones-familia-n-min.png`,
        },
        {
          id: 2,
          src: `https://www.busesycamioneschevrolet.com.co/wp-content/uploads/2022/02/banner-camiones-familia-f.jpg}`,
        },
        {
          id: 3,
          src: `https://i.pinimg.com/originals/a2/3a/a9/a23aa91c58f44ed000a33232c3f17332.jpg`,
        },
      ],
    };
  },
};
</script>

<style scoped>
.carousel-image {
  height: 200px;  /* Ajusta este valor a la altura que desees */
  object-fit: cover;  /* Esto asegura que las imágenes se redimensionen correctamente */
}
</style>