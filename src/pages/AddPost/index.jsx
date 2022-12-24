import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'
import TextField from '@mui/material/TextField'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import SimpleMDE from 'react-simplemde-editor'
import { selectIsAuth } from '../../redux/slice/auth'
import axios from '../../axios'

import 'easymde/dist/easymde.min.css'
import styles from './AddPost.module.scss'

export const AddPost = () => {
  const navigate = useNavigate()
  const isAuth = useSelector(selectIsAuth)
  const [isLoading, setIsLoading] = React.useState(false)
  const [imageUrl, setImageUrl] = React.useState('')
  const [text, setText] = React.useState('')
  const [title, setTitle] = React.useState('')
  const [tags, setTags] = React.useState('')
  const inputFileRef = React.useRef(null)

  const handleChangeFile = async event => {
    try {
      const formData = new FormData()
      const file = event.target.files[0]
      formData.append('image', file)
      const { data } = await axios.post('/uploads', formData)
      setImageUrl(data.url)
    } catch (err) {
      console.warn(err)
      alert('Не удалось загрузить файл...')
    }
  }

  const onClickRemoveImage = () => {
    alert('Удалить?')
    setImageUrl('')
  }

  const onChange = React.useCallback(value => {
    setText(value)
  }, [])

  const onSubmit = async () => {
    try {
      setIsLoading(true)

      const fields = {
        title,
        tags: tags.split(','),
        text,
        imageUrl
      }

      const { data } = await axios.post('/posts', fields)

      const id = data._id
      navigate(`/posts/${id}`)
    } catch (err) {
      console.warn(err)
      alert('Ошибка при создании статьи!')
    }
  }

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Введите текст...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000
      }
    }),
    []
  )

  if (!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to='/' />
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button onClick={() => inputFileRef.current.click()} variant='outlined' size='large'>
        Загрузить превью
      </Button>
      <input ref={inputFileRef} type='file' onChange={handleChangeFile} hidden />
      {imageUrl && (
        <>
          <Button variant='contained' color='error' onClick={onClickRemoveImage}>
            Удалить
          </Button>
          <img className={styles.image} src={`http://localhost:4444${imageUrl}`} alt='Uploaded' />
        </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        value={title}
        onChange={e => setTitle(e.target.value)}
        variant='standard'
        placeholder='Заголовок статьи...'
        fullWidth
      />
      <TextField
        classes={{ root: styles.tags }}
        value={tags}
        onChange={e => setTags(e.target.value)}
        variant='standard'
        placeholder='Тэги'
        fullWidth
      />
      <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size='large' variant='contained'>
          Опубликовать
        </Button>
        <a href='/'>
          <Button size='large'>Отмена</Button>
        </a>
      </div>
    </Paper>
  )
}
