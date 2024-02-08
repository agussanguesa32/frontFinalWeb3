<template>
    <nav class="navbar navbar-expand-lg custom-navbar">
      <div class="container-fluid justify-content-between">
        <div class="collapse navbar-collapse justify-content-center" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link" href="/ordenes">Ordenes</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/cargas-actuales">Cargas Actuales</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/conciliaciones">Conciliaciones</a>
            </li>
          </ul>
        </div>
        <a class="nav-link" href="/login">
          <i class="bi bi-person-fill fs-3"></i>
        </a>
      </div>
    </nav>
  </template>
  
  <style scoped>
  .custom-navbar {
    background-color: #6f42c1; /* Este es un tono de violeta */
    color: white;
  }
  .nav-link {
    color: white;
  }
  .nav-link:hover {
    color: white;
  }
  </style>