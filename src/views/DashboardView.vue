<script setup>
import {useUserStore} from "@/stores/user";

const userStore = useUserStore();
</script>

<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div v-if="userStore.user.isLoggedIn">

            <div class="card-header">Welcome, {{userStore.user.name}}</div>
            <div class="card-body">
              <div class="alert alert-success" role="alert">
                You are logged in!
                <div class="my-4">
                  <button  @click.prevent="signOut" class="btn btn-primary">Log Out</button>
                </div>
              </div>
            </div>

          </div>
          <div v-else class="alert alert-danger" role="alert">
            You are not logged in!
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
