<script>
import { ref, defineComponent, onMounted } from 'vue'
import { useCurrentUser } from 'vuefire'
import { db } from '@/firebase'
import { collection, doc, getDocs, query, where } from 'firebase/firestore'

export default defineComponent({
  setup() {
    const user = useCurrentUser();
    const allusers = ref(0);
    const users = ref([]);
    const me = ref([]);
    const docid = ref([])
    const posts = ref([]);

    async function queryCollection(){
      let collRef = collection(db, "users");
      let querySnap = await getDocs(collRef);
      if (querySnap.empty) {
        console.warn("No documents found!");
        return;
      }
      users.value = querySnap.docs.map( docSnap => docSnap.data() );
      allusers.value = users.value.length;
      console.log("allusers: ", allusers.value);
      console.log("users: ", users.value);
      console.log("type of user.displayName is:", typeof user.value.displayName)
      console.log("user: ", user.value.displayName);

      // querying for users
      try {
      me.value = query(collRef, where("name", "==", user.value.displayName));
      const meSnap = await getDocs(me.value);
      docid.value = meSnap.docs.map( docSnap => docSnap.id );
      console.log("docid: ", docid.value[0]);
      // meSnap.forEach(doc => {
      //   console.log(doc.id, " => ", doc.data());
      // });
      console.log("me: ", meSnap.docs.map( docSnap => docSnap.data() ));
      } catch  {
        console.log('error');
      }

      // query for user post
      try {
      const postsRef = collection(db, "users", docid.value[0],'posts');
      console.log("postRef: ", postsRef);
      const postsSnap = await getDocs(postsRef);
      posts.value = postsSnap.docs.map( docSnap => docSnap.data() );
      console.log("posts: ", posts.value);
      const post3ref = doc(db, "users", docid.value[0], "posts", "post3");
      const post3snap = await getDocs(post3ref);
      const post3 = post3snap.data();
      console.log("post3: ", post3);
      // const postRef = collection(userRef, "posts");
      // console.log("postRef: ", postRef);
      // const postSnap = await getDocs(postRef);
      // posts.value = postSnap.docs.map( docSnap => docSnap.data() );
      // console.log("posts: ", posts.value);



      } catch (error) {
        console.log(error);
      }
      // let me = users.value.
    }

    onMounted(() => {
      // getUserCount();
      queryCollection();
    });
    return {
      user,
      users,
      allusers
    };
  },
});
</script>

<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div v-if="user">
            <div class="card-header">Welcome, {{ user.displayName }}</div>
            <div class="card-body">
              <div class="alert alert-success" role="alert">You are logged in!</div>
            </div>
          </div>
          <div v-else class="alert alert-danger" role="alert">You are not logged in!</div>
        </div>
      </div>
      <p>  Total user count: {{ allusers }}</p>
    </div>
  </div>
</template>
