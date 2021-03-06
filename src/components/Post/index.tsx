
import { format, formatDistanceToNow } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { ChangeEvent, FormEvent, useCallback, useState } from 'react';
import { Author, Content } from '../../App';
import { Avatar } from '../Avatar';
import { Comment } from '../Comment';
import styles from './styles.module.css';

interface PostProps {
  author: Author;
  content: Content[];
  publishedAt: Date;
}

export function Post({ author, content, publishedAt }: PostProps) {
  const [comments, setComments] = useState([
    'Post muito bacana, hein?!'
  ]);
  const [newCommentText, setNewCommentText] = useState('');

  const publishedDateFormatted = format(publishedAt, "d 'de' LLLL 'às' HH:mm'h'", {
    locale: ptBR,
  });

  const publishedDateRelativeToNow = formatDistanceToNow(publishedAt, {
    locale: ptBR,
    addSuffix: true
  });

  function handleCreateNewComment(e: FormEvent) {
    e.preventDefault();

    setComments([...comments, newCommentText])
    setNewCommentText('')
  }

  function handleNewCommentChange(e: ChangeEvent<HTMLTextAreaElement>) {
    e.target.setCustomValidity('');
    setNewCommentText(e.target.value)
  };

  function handleNewCommentInvalid(e: ChangeEvent<HTMLTextAreaElement>) {
    e.target.setCustomValidity("Esse campo é obrigatório")
  };

  const deleteComment = useCallback((comment: string) => {
    setComments(
      comments.filter(commentState => commentState !== comment)
    )
  }, [comments]);

  const isNewCommentEmpty = !newCommentText; // or newCommentText.length === 0;

  return (
    <article className={styles.post}>
      <header>
        <div className={styles.author}>
          <Avatar src={author.avatarUrl} />
          <div className={styles.authorInfo}>
            <strong>{author.name}</strong>
            <span>{author.role}</span>
          </div>
        </div>

        <time title={publishedDateFormatted} dateTime={publishedAt.toISOString()}>
          {publishedDateRelativeToNow}
        </time>
      </header>

      <div className={styles.content}>
        {content.map(line => {
          if(line.type === "paragraph") {
            return <p key={line.content}>{line.content}</p>
          }
          return <p key={line.content}><a href="">{line.content}</a></p>
          
        })}
      </div>
      
      <form onSubmit={handleCreateNewComment} className={styles.commentForm}>
        <strong>Deixe seu feedback</strong>

        <textarea 
          name="comment"
          value={newCommentText}
          onChange={handleNewCommentChange}
          required
          onInvalid={handleNewCommentInvalid}
          placeholder="Deixe um comentário"
        />

        <footer>
          <button type="submit" disabled={isNewCommentEmpty}>Publicar</button>
        </footer>
      </form>

      <div className={styles.commentList}>
        {comments.map(content => (
          <Comment onDeleteComment={deleteComment} key={content} content={content}/>
        ))}
      </div>
    </article>
  )
}