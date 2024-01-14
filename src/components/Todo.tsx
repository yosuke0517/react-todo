import { FormEvent } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  ArrowRightOnRectangleIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/solid'
import useStore from '../store'
import { useQueryTasks } from '../hooks/useQueryTasks'
import { useMutateTask } from '../hooks/useMutateTask'
import { useMutateAuth } from '../hooks/useMutateAuth'
import { TaskItem } from './TaskItem'

export const Todo = () => {
  const queryClient = useQueryClient()
  const { editedTask } = useStore()
  const updateTask = useStore((state) => state.updateEditedTask)
  const { data, isLoading } = useQueryTasks()
  const { createTaskMutation, updateTaskMutation } = useMutateTask()
  const { logoutMutation } = useMutateAuth()
  const submitTaskHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (editedTask.id === 0)
      createTaskMutation.mutate({
        title: editedTask.title,
      })
    else {
      updateTaskMutation.mutate(editedTask)
    }
  }
  const logout = async () => {
    await logoutMutation.mutateAsync()
    queryClient.removeQueries(['tasks'])
  }
  return (
    <div className="flex min-h-screen flex-col items-center justify-center font-mono text-gray-600">
      <div className="my-3 flex items-center">
        <ShieldCheckIcon className="mr-3 h-8 w-8 cursor-pointer text-indigo-500" />
        <span className="text-center text-3xl font-extrabold">
          Task Manager
        </span>
      </div>
      <ArrowRightOnRectangleIcon
        onClick={logout}
        className="my-6 h-6 w-6 cursor-pointer text-blue-500"
      />
      <form onSubmit={submitTaskHandler}>
        <input
          className="mb-3 mr-3 border border-gray-300 px-3 py-2"
          placeholder="title ?"
          type="text"
          onChange={(e) => updateTask({ ...editedTask, title: e.target.value })}
          value={editedTask.title || ''}
        />
        <button
          className="mx-3 rounded bg-indigo-600 px-3 py-2 text-white disabled:opacity-40"
          disabled={!editedTask.title}
        >
          {editedTask.id === 0 ? 'Create' : 'Update'}
        </button>
      </form>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul className="my-5">
          {data?.map((task) => (
            <TaskItem key={task.id} id={task.id} title={task.title} />
          ))}
        </ul>
      )}
    </div>
  )
}
