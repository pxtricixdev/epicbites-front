<template>
  <section class="recipe-page">
    <div class="recipe-page__main">
      <div v-if="loadingDetail" class="recipe-page__loading">
        <p>Cargando...</p>
      </div>
      <div v-if="recipeDetail" class="recipe-page__container">
        <!-- Contenido existente sin cambios -->
        <div class="recipe-page__top-content">
          <div class="recipe-page__image">
            <img :src="recipeDetail.image" alt="Imagen de la receta" />
          </div>
          <div>
            <div class="recipe-page__info">
              <h1 class="recipe-page__title">{{ recipeDetail.name }}</h1>
              <p class="recipe-page__description">{{ recipeDetail.description }}</p>
              <p class="recipe-page__author">{{ recipeDetail.userName }}</p>

              <div class="recipe-page__meta">
                <span class="recipe-page__score">
                  <EstrellaRating /> {{ recipeDetail.score }}
                </span>
                <span class="recipe-page__time">⏳ {{ recipeDetail.time }} min</span>
                <span class="recipe-page__calories">🔥 {{ recipeDetail.calories }} kcal</span>
                <span class="recipe-page__difficulty">
                  {{ getDifficultyEmoji(recipeDetail.difficulty) }}
                  {{ recipeDetail.difficulty }}</span
                >
              </div>
              <Toaster richColors />
              <div class="recipe-page__buttons" :style="{ gap: !isAuthenticated ? '0px' : '20px' }">
                <div class="recipe-page__favorite">
                  <button v-if="isAuthenticated" @click="handlePostFavorite">Favoritos ❤️</button>
                </div>
                <RecipePrintButton />
              </div>
            </div>
            <div class="recipe-page__ingredients">
              <h2>🛒 <span>Ingredientes</span></h2>
              <ul>
                <li v-for="ingredient in recipeDetail.ingredients" :key="ingredient.ingredientId">
                  {{ ingredient.quantity }} {{ ingredient.unit }} - {{ ingredient.ingredientName }}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="recipe-page__details">
          <div class="recipe-page__steps">
            <h2>🍽️ <span>Pasos a seguir</span></h2>
            <ul>
              <li class="recipe-page__steps__list">
                <div v-html="recipeDetail.steps" class="recipe-page__steps__content"></div>
              </li>
            </ul>
          </div>
        </div>
        <div class="recipe-notes">
          <h2 class="recipe-notes__title">📝 <span>Mis notas personales</span></h2>
          <div v-if="isAuthenticated" class="recipe-notes__form">
            <textarea
              v-model="noteText"
              placeholder="Añade una nota personal para esta receta..."
              class="recipe-notes__textarea"
            ></textarea>
            <button
              @click="handleCreateNote"
              class="recipe-notes__button"
              :disabled="!noteText.trim() || loadingCreateNote"
            >
              {{ loadingCreateNote ? 'Guardando...' : 'Guardar nota' }}
            </button>
          </div>
          <div v-if="loadingNotes" class="recipe-notes__loading">
            <p>Cargando notas...</p>
          </div>

          <div v-else-if="userNotes.length > 0" class="recipe-notes__list">
            <NoteCard
              v-for="note in userNotes"
              :key="note.id"
              :text="note.noteText"
              @delete="showDeleteConfirmation(note.id)"
            />
          </div>
          <div v-else class="recipe-notes__empty">
            <p>No tienes notas para esta receta</p>
            <p v-if="isAuthenticated">Añade una nota para recordar tus cambios personales.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Resto del componente sin cambios -->
  <section class="reviews">
    <div class="reviews__container">
      <h2 class="reviews__title"><span>Opiniones</span></h2>

      <div v-if="loadingReviewsByRecipe" class="reviews__loading">
        <p>Cargando opiniones...</p>
      </div>

      <div v-if="reviewsByRecipe.length === 0" class="reviews__empty">
        <p>No hay opiniones para esta receta todavía.</p>
        <p v-if="isAuthenticated">¡Sé el primero en comentar!</p>
      </div>

      <div v-if="reviewsByRecipe" class="reviews__list">
        <div v-for="review in reviewsByRecipe" :key="review.reviewId" class="reviews__item">
          <div class="reviews__header">
            <div class="reviews__user-info">
              <strong class="reviews__username">{{ review.userName }}</strong>
            </div>
            <div class="reviews__rating">
              <EstrellaRating />
              <span>{{ review.reviewScore }}</span>
            </div>
          </div>
          <p class="reviews__comment">{{ review.reviewText }}</p>
          <p class="reviews__date">{{ formatDate(review.reviewDate) }}</p>
        </div>
      </div>
    </div>

    <div v-if="isAuthenticated && !isReviewed && !isTheUserTheOwner">
      <form @submit="handlePost" class="reviews__form">
        <div class="reviews__form__text">
          <h3>Comparte tu experiencia</h3>
          <p>
            ¿Has probado esta receta? Nos encantaría conocer tu opinión. Tus comentarios ayudan a
            otros cocineros a decidir si quieren prepararla.
          </p>
        </div>
        <textarea
          required
          maxlength="600"
          name="review"
          id="review"
          placeholder="Escribe tu reseña aquí"
          v-model="reviewForm.text"
        ></textarea>
        <div class="reviews__form__score">
          <label for="score">Puntúa la receta: </label>
          <StarRating v-model="reviewForm.score" />
        </div>
        <div class="reviews__form__button">
          <button>Publicar</button>
        </div>
      </form>
    </div>
  </section>

  <!-- Diálogo de confirmación integrado directamente en la página -->
  <div v-if="showConfirmDialog" class="delete-confirm-overlay">
    <div class="delete-confirm-dialog">
      <h3 class="delete-confirm-dialog__title">Confirmar eliminación</h3>
      <p class="delete-confirm-dialog__message">¿Estás seguro de que quieres eliminar esta nota?</p>
      <div class="delete-confirm-dialog__buttons">
        <button
          @click="confirmDeleteNote"
          class="delete-confirm-dialog__button delete-confirm-dialog__button--confirm"
        >
          Sí
        </button>
        <button
          @click="cancelDeleteNote"
          class="delete-confirm-dialog__button delete-confirm-dialog__button--cancel"
        >
          No
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, watch, ref } from 'vue'
import EstrellaRating from '@/components/SvgEstrella.vue'
import StarRating from '@/components/StarRating.vue'
import { useRecipeStore } from '@/stores/recipeStore'
import { useReviewStore } from '@/stores/reviewStore'
import { authStore } from '@/stores/authStore'
import { useRecipeNoteStore } from '@/stores/noteStore'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import type { IPostReview } from '@/stores/interfaces/IPostReview'
import { useFavoriteStore } from '@/stores/favoriteStore'
import type { IPostFavorite } from '@/stores/interfaces/IPostFavorite'
import { Toaster, toast } from 'vue-sonner'
import RecipePrintButton from '@/components/RecipePrintButton.vue'
import NoteCard from '@/components/NoteCard.vue'

const route = useRoute()
const recipeNoteStore = useRecipeNoteStore()

const recipeStore = useRecipeStore()
const { recipeDetail, loadingDetail } = storeToRefs(recipeStore)
const { fetchRecipeDetail } = recipeStore

const noteText = ref('')
const loadingNotes = ref(false)
const loadingCreateNote = ref(false)
const userNotes = ref<
  { id: number; userId: number; recipeId: number; noteText: string; createdDate: string }[]
>([])

// Variables para el diálogo de confirmación
const showConfirmDialog = ref(false)
const noteToDelete = ref<number | null>(null)

const getDifficultyEmoji = (difficulty: string) => {
  if (difficulty === 'Facil') return '🟢'
  else if (difficulty === 'Media') return '🟠'
  else return '🔴'
}

const reviewStore = useReviewStore()
const { reviewsByRecipe, loadingReviewsByRecipe } = storeToRefs(reviewStore)
const { fetchReviewsByRecipe, clearReviewsByRecipe, createReview } = reviewStore

const favoriteStore = useFavoriteStore()
const { createFavorite } = favoriteStore

const auth = authStore()
const { isAuthenticated } = auth

const isReviewed = ref(false)
const isTheUserTheOwner = ref(false)

const checkIfUserHasReviewARecipe = () => {
  isReviewed.value = reviewsByRecipe.value.some((review) => review.userName === auth.username)
}

const checkIfUserHasPostTheRecipe = () => {
  isTheUserTheOwner.value = recipeDetail.value?.userName === auth.username
}

const fetchUserNotes = async () => {
  if (!auth.isAuthenticated || !auth.userId) return

  loadingNotes.value = true
  try {
    await recipeNoteStore.fetchNotesByUser(auth.userId)
    const recipeId = Number(Array.isArray(route.params.id) ? route.params.id[0] : route.params.id)
    userNotes.value = recipeNoteStore.notesByUser.filter((note) => note.recipeId === recipeId)
  } catch (err) {
    console.error('Error al cargar notas:', err)
  } finally {
    loadingNotes.value = false
  }
}

const handleCreateNote = async () => {
  if (!noteText.value.trim() || loadingCreateNote.value) return

  loadingCreateNote.value = true
  try {
    const recipeId = Number(Array.isArray(route.params.id) ? route.params.id[0] : route.params.id)
    const newNote = await recipeNoteStore.createNote({
      recipeId: recipeId,
      noteText: noteText.value.trim(),
      userId: auth.userId ?? 0,
    })

    // Añadir la nueva nota directamente al array sin tener que recargar todas
    if (newNote && newNote.id) {
      userNotes.value.unshift({
        id: newNote.id,
        userId: auth.userId ?? 0,
        recipeId: recipeId,
        noteText: noteText.value.trim(),
        createdDate: new Date().toISOString(),
      })
    }

    noteText.value = ''
    toast.success('Nota guardada correctamente')
  } catch (err) {
    console.error('Error al crear la nota:', err)
    toast.error('No se pudo guardar la nota')
  } finally {
    loadingCreateNote.value = false
  }
}

// Métodos para el diálogo de confirmación
const showDeleteConfirmation = (noteId: number) => {
  noteToDelete.value = noteId
  showConfirmDialog.value = true
}

const confirmDeleteNote = async () => {
  if (noteToDelete.value === null) return

  try {
    await recipeNoteStore.deleteNote(noteToDelete.value)

    // Eliminar la nota directamente del array sin recargar
    userNotes.value = userNotes.value.filter((note) => note.id !== noteToDelete.value)

    toast.success('Nota eliminada correctamente')
  } catch (err) {
    console.error('Error al eliminar la nota:', err)
    toast.error('No se pudo eliminar la nota')
  } finally {
    showConfirmDialog.value = false
    noteToDelete.value = null
  }
}

const cancelDeleteNote = () => {
  showConfirmDialog.value = false
  noteToDelete.value = null
}

const loadData = async (id: string) => {
  clearReviewsByRecipe()

  await fetchRecipeDetail(id)
  await fetchReviewsByRecipe(id)
  await fetchUserNotes()
  checkIfUserHasPostTheRecipe()
  checkIfUserHasReviewARecipe()
}

onMounted(async () => {
  const id = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
  await loadData(id)
})

watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      const id = Array.isArray(newId) ? newId[0] : newId
      await loadData(id)
    }
  },
)

const formatDate = (dateString: Date) => {
  if (!dateString) return ''

  const date = new Date(dateString)

  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const reviewForm = reactive({
  text: '',
  date: new Date().toISOString(),
  score: 1,
  userId: auth.userId,
  recipeId: Number(Array.isArray(route.params.id) ? route.params.id[0] : route.params.id),
})

const handlePost = async (e: Event) => {
  e.preventDefault()

  const reviewData = {
    text: reviewForm.text,
    date: reviewForm.date,
    score: Number(reviewForm.score),
    userId: Number(reviewForm.userId),
    recipeId: Number(reviewForm.recipeId),
  }

  try {
    await createReview(reviewData as IPostReview)

    reviewForm.text = ''
    reviewForm.score = 1
    await fetchReviewsByRecipe(reviewData.recipeId)
    checkIfUserHasReviewARecipe()
  } catch (error) {
    console.error('Error al crear la reseña:', error)
  }
}

const favoriteForm = reactive({
  date: new Date().toISOString(),
  userId: auth.userId,
  recipeId: Number(Array.isArray(route.params.id) ? route.params.id[0] : route.params.id),
})

const handlePostFavorite = async (e: Event) => {
  e.preventDefault()

  const reviewFavorite = {
    date: favoriteForm.date,
    userId: favoriteForm.userId,
    recipeId: favoriteForm.recipeId,
  }

  try {
    await createFavorite(reviewFavorite as IPostFavorite)
    toast.success('Receta añadida a favoritos')
  } catch (error) {
    console.error('Error al añadir a favoritos', error)
    toast.error('Error al añadir la receta a favoritos')
  }
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

/* Estilo del diálogo de confirmación */
.delete-confirm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.delete-confirm-dialog {
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  font-family: $body;

  &__title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 10px;
    color: $black;
    font-family: $body;
  }

  &__message {
    font-size: 14px;
    margin-bottom: 20px;
    color: $black;
    font-family: $body;
  }

  &__buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }

  &__button {
    font-family: $body;
    padding: 8px 16px;
    border-radius: 6px;
    border: none;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;

    &--confirm {
      background-color: #ff5252;
      color: white;

      &:hover {
        background-color: #ff3838;
      }
    }

    &--cancel {
      background-color: #e0e0e0;
      color: $black;

      &:hover {
        background-color: #d0d0d0;
      }
    }
  }
}

/* Mantener los estilos existentes tal como están */
.recipe-page {
  max-width: 1200px;
  margin: 40px auto 10px auto;
  padding: 20px;
  font-family: $body;

  &__top-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 70px;

    @media (min-width: 768px) {
      align-items: flex-start;
    }
  }

  &__loading {
    font-size: 16px;
    color: $black;
    text-align: center;
  }

  &__main {
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
    text-align: center;
  }

  &__buttons {
    display: flex;
    flex-direction: row;
  }

  &__image {
    width: 100%;
    max-width: 350px;

    img {
      width: 100%;
      border-radius: 12px;
      object-fit: cover;
    }
  }

  &__info {
    width: 100%;
    max-width: 500px;
    text-align: center;
  }

  &__title {
    font-size: 28px;
    color: $black;
    font-family: $body;
  }

  &__description {
    font-size: 18px;
    margin-top: 10px;
    color: $black;
  }

  &__author {
    font-size: 16px;
    color: #777777;
    font-weight: 600;
    margin-top: 5px;
  }

  &__meta {
    display: flex;
    justify-content: center;
    gap: 10px;
    font-size: 14px;
    margin: 10px 0;
    color: $black;
  }

  &__score,
  &__time,
  &__calories,
  &__difficulty {
    padding: 6px 12px;
    border-radius: 8px;
    font-weight: bold;
    font-size: 16px;
  }

  &__favorite {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    @media (min-width: 768px) {
      justify-content: flex-start;
    }

    button {
      border: 1px solid #ff2c2c;
      background-color: transparent;
      padding: 6px 10px;
      border-radius: 5px;
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 5px;
      cursor: pointer;
      font-size: 14px;
      transition: 0.1s ease-in-out;
      color: #ff2c2c;
      font-weight: 500;

      &:hover {
        background-color: #f7d1d1;
      }
    }
  }

  &__ingredients {
    width: 100%;
    max-width: 500px;
    text-align: left;
    margin-top: 30px;
  }

  &__steps {
    margin-top: 30px;
    &__list {
      max-width: 910px;
      height: auto;
    }
  }

  h2 {
    font-size: 20px;
    margin-bottom: 10px;
    color: $black;
    font-family: $body;
  }

  ul {
    list-style: none;
    padding: 0;

    li {
      font-size: 14px;
      margin-bottom: 12px;
      line-height: 1.5;
      background: $white;
      padding: 10px;
      border-radius: 8px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
      color: $black;

      strong {
        color: $black;
        font-size: 16px;
      }
    }
  }

  @media (min-width: 768px) {
    .recipe-page {
      &__top-content {
        display: flex;
        flex-direction: row;
        gap: 70px;
      }
      &__container {
        display: flex;
        flex-direction: column;
        text-align: left;
        gap: 30px;
        margin-bottom: 30px;
      }

      &__image {
        width: 50%;
        max-width: 350px;
      }

      &__info {
        text-align: left;
      }

      &__meta {
        justify-content: flex-start;
      }

      &__steps {
        margin-top: 10px;
      }
    }
  }
}

.reviews {
  max-width: 1200px;
  margin: 0 auto 40px auto;
  padding: 20px;
  font-family: $body;

  &__container {
    background-color: $white;
    border-radius: 12px;
    padding: 30px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }

  &__title {
    font-size: 24px;
    color: $black;
    margin-bottom: 25px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  &__loading,
  &__empty {
    text-align: center;
    padding: 20px;
    font-size: 16px;
    color: $black;
    background: rgba(0, 0, 0, 0.03);
    border-radius: 8px;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  &__item {
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
    background-color: $white;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  &__user-info {
    display: flex;
    flex-direction: column;
  }

  &__username {
    font-size: 16px;
    color: $black;
  }

  &__rating {
    display: flex;
    align-items: center;
    gap: 5px;
    font-weight: bold;
    color: $black;
  }

  &__comment {
    font-size: 14px;
    line-height: 1.6;
    color: $black;
  }

  &__date {
    font-size: 12px;
    font-weight: 500;
    margin-top: 5px;
    color: #a2a2a2;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 30px;
    color: $black;
    background-color: #ffffff;
    padding: 20px 30px;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);

    textarea,
    select {
      background-color: $white;

      box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
    }

    textarea {
      padding: 8px 12px;
      color: #777777;
      font-size: 14px;
    }

    select {
      padding-left: 10px;
      padding-right: 5px;
      color: $black;
      font-size: 14px;
    }

    &__score {
      display: flex;
      flex-direction: row;
      gap: 10px;
      align-items: center;
      margin-top: 5px;
      margin-bottom: 5px;
    }

    &__text {
      display: flex;
      flex-direction: column;
      gap: 5px;

      p {
        font-size: 14px;
      }
    }

    &__button {
      margin: 10px auto;
      button {
        background-color: $primary-yellow;
        color: $black;
        border-radius: 5px;
        border: none;
        padding: 6px 25px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
      }
    }
  }
}

.recipe-notes {
  margin: 30px 0;
  font-family: $body;

  &__title {
    font-size: 20px;
    margin-bottom: 15px;
    color: $black;
    font-family: $body;
    display: flex;
    align-items: center;
    gap: 8px;

    span {
      font-weight: normal;
    }
  }

  &__form {
    background-color: $white;
    padding: 15px;
    border-radius: 12px;
    margin-bottom: 20px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__textarea {
    width: 100%;
    min-height: 80px;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-family: inherit;
    resize: vertical;
    font-size: 14px;
    background-color: white;
    color: $black;

    &:focus {
      outline: none;
      border-color: $secondary-orange;
    }
  }

  &__button {
    align-self: flex-end;
    background-color: $primary-yellow;
    color: $black;
    border: none;
    padding: 8px 16px;
    border-radius: 5px;
    cursor: pointer;
    font-weight: 500;
    font-size: 14px;

    &:disabled {
      background-color: #e0e0e0;
      color: #999;
      cursor: not-allowed;
    }
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__item {
    background-color: $white;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    position: relative;
    color: $black;
    font-size: 14px;
  }

  &__text {
    margin: 0;
    line-height: 1.5;
  }

  &__delete {
    position: absolute;
    top: 8px;
    right: 8px;
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    color: #999;

    &:hover {
      color: #ff5252;
    }
  }

  &__loading,
  &__empty {
    text-align: center;
    padding: 20px;
    font-size: 14px;
    color: #666;
    background: rgba(0, 0, 0, 0.03);
    border-radius: 8px;
  }
}
</style>
