<template>
    <div class="settings-view">
        <div class="user-info">
            <h1 class="username">{{ username }}</h1>
        </div>
        <div class="options">
            <div class="option-card">
                <div class="card-content card">
                    <h2>Email Personalizado</h2>
                    <button @click="openEmailModal">Modificar</button>
                </div>
            </div>
            <div class="option-card">
                <div class="card-content card">
                    <h2>Temperatura Umbral</h2>
                    <button @click="openTemperatureModal">Modificar</button>
                </div>
            </div>
        </div>
        <div class="modals">
            <!-- Email Modal -->
            <div v-if="showEmailModal" class="modal">
                <!-- Email modal content -->
            </div>
            <!-- Temperature Modal -->
            <div v-if="showTemperatureModal" class="modal">
                <!-- Temperature modal content -->
            </div>
        </div>
    </div>
</template>

<script>
import Cookies from 'js-cookie';

export default {
    data() {
        return {
            username: atob(Cookies.get('username')), 
            showEmailModal: false,
            showTemperatureModal: false
        };
    },
    methods: {
        openEmailModal() {
            this.showEmailModal = true;
        },
        openTemperatureModal() {
            this.showTemperatureModal = true;
        }
    }
};
</script>

<style scoped>

.user-info {
    text-align: center;
    margin-top: 20px;
}

.options {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}
.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  background-color: #f5f5f5;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
  padding: 20px;
  margin: 10px;
}

.card h2 {
  color: #333;
  margin-bottom: 20px;
}
</style>
