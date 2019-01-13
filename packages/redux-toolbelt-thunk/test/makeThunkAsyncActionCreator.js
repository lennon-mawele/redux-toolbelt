import makeAsyncThunkActionCreator from '../src/makeThunkAsyncActionCreator'
import { isActionCreator } from '../../redux-toolbelt/src/utils'

import configureMockStore from 'redux-mock-store'
// import { applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

const noop = () => {}
const EXTRA_THUNK_ARG = {}

const mockStore = configureMockStore([thunk.withExtraArgument(EXTRA_THUNK_ARG)])

test('Creates actions with all expected type info and sub action', () => {
  const actionCreatorA = makeAsyncThunkActionCreator('A', noop)
  const actionCreatorB = makeAsyncThunkActionCreator('B', noop, x => ({ x }))
  const actionCreatorC = makeAsyncThunkActionCreator('C', noop, x => ({ payload: x, meta: x }))

  expect(actionCreatorA.TYPE).toBe('A@ASYNC_REQUEST')
  expect(actionCreatorB.TYPE).toBe('B@ASYNC_REQUEST')
  expect(actionCreatorC.TYPE).toBe('C@ASYNC_REQUEST')
  expect(isActionCreator(actionCreatorA)).toBe(true)
  expect(isActionCreator(actionCreatorB)).toBe(true)
  expect(isActionCreator(actionCreatorC)).toBe(true)

  expect(actionCreatorA.success.TYPE).toBe('A@ASYNC_SUCCESS')
  expect(actionCreatorB.success.TYPE).toBe('B@ASYNC_SUCCESS')
  expect(actionCreatorC.success.TYPE).toBe('C@ASYNC_SUCCESS')
  expect(isActionCreator(actionCreatorA.success)).toBe(true)
  expect(isActionCreator(actionCreatorB.success)).toBe(true)
  expect(isActionCreator(actionCreatorC.success)).toBe(true)

  expect(actionCreatorA.failure.TYPE).toBe('A@ASYNC_FAILURE')
  expect(actionCreatorB.failure.TYPE).toBe('B@ASYNC_FAILURE')
  expect(actionCreatorC.failure.TYPE).toBe('C@ASYNC_FAILURE')
  expect(isActionCreator(actionCreatorA.failure)).toBe(true)
  expect(isActionCreator(actionCreatorB.failure)).toBe(true)
  expect(isActionCreator(actionCreatorC.failure)).toBe(true)
})

test('Creates actions that calls the async function and passes params', () => {
  const actionCreator = makeAsyncThunkActionCreator('test', v => v)
  const store = mockStore()

  return store.dispatch(actionCreator('b'))
    .then(result => expect(result).toBe('b'))
})

test('Handles correctly successful async', () => {
  const actionCreator = makeAsyncThunkActionCreator('A', v => `ping pong ${v}`, { defaultMeta: {a: true} })
  const store = mockStore()

  return store.dispatch(actionCreator('b'))
    .then(result => {
      expect(result).toBe('ping pong b')

      const actions = store.getActions()

      actions.forEach(action => {
        expect(action.meta).toEqual({a: true, _toolbeltAsyncFnArgs: ['b']})
      })

      expect(actions[0].type).toBe(actionCreator.TYPE)
      expect(actions[0].payload).toBe('b')

      expect(actions[1].type).toBe(actionCreator.success.TYPE)
      expect(actions[1].payload).toBe('ping pong b')

      expect(actions).toHaveLength(2)
    })
})

test('Handles correctly failed async', () => {
  const actionCreator = makeAsyncThunkActionCreator('A1', v => {throw new Error(v)}, { defaultMeta: {a1: true} })
  const store = mockStore()
  return store.dispatch(actionCreator('b1'))
    .catch(error => {
      expect(error.message).toBe('b1')

      const actions = store.getActions()

      actions.forEach(action => {
        expect(action.meta).toEqual({a1: true, _toolbeltAsyncFnArgs: ['b1']})
      })

      expect(actions[0].type).toBe(actionCreator.TYPE)
      expect(actions[0].payload).toBe('b1')

      expect(actions[1].type).toBe(actionCreator.failure.TYPE)
      expect(actions[1].payload instanceof Error).toBe(true)
      expect(actions[1].payload.message).toBe('b1')

      expect(actions).toHaveLength(2)
    })
})

test('Expending the default meta', () => {
  const fetchUserAction = makeAsyncThunkActionCreator(
    'FETCH_USER',
    userId => Promise.resolve({ id: userId }),
    { defaultMeta: {ignore: true} }
  )

  const store = mockStore()
  return store.dispatch(fetchUserAction('01', { log: true }))
    .then(result => {
      expect(result).toEqual({ id: '01' })

      const actions = store.getActions()

      expect(actions[0].payload).toEqual('01')
      actions.forEach(action => {
        expect(action.meta).toEqual({
          ignore: true, log: true,
          _toolbeltAsyncFnArgs: ['01', { log: true }],
        })
      })

    })
})

const wait = () => new Promise(resolve => setTimeout(resolve, 1))
const mockUserFetchRequest = (userData) => wait().then(() => userData)

describe('Custom args mapper', () => {
  const fetchUserAction = makeAsyncThunkActionCreator(
    'FETCH_USER',
    (userId, name, year) => mockUserFetchRequest({id: userId, name, year}),
    (userId, name, year, _meta) => ({
      payload: {id: userId, name, year},
      meta: _meta || {},
    }),
    { defaultMeta: {ignore: true} }
  )

  test('without meta in action call', () => {
    const store = mockStore()
    return store.dispatch(fetchUserAction('01', 'james', '2020'))
      .then(result => {
        expect(result).toEqual({ id: '01', name: 'james', year: '2020' })

        const actions = store.getActions()

        actions.forEach(action => {
          expect(action.meta).toEqual({
            ignore: true,
            _toolbeltAsyncFnArgs: ['01', 'james', '2020'],
          })
        })

      })
  })

  test('with meta in action call', () => {
    const store = mockStore()
    return store.dispatch(fetchUserAction('01', 'james', '2020', {log: true}))
      .then(result => {
        expect(result).toEqual({ id: '01', name: 'james', year: '2020' })

        const actions = store.getActions()

        actions.forEach(action => {
          expect(action.meta).toEqual({
            ignore: true,
            log: true,
            _toolbeltAsyncFnArgs: ['01', 'james', '2020', {log: true}],
          })
        })

      })
  })

})

describe('Custom args mapper (argsMapper in options)', () => {
  const fetchUserAction = makeAsyncThunkActionCreator(
    'FETCH_USER',
    (userId, name, year) => mockUserFetchRequest({id: userId, name, year}),
    {
      defaultMeta: {ignore: true},
      argsMapper: (userId, name, year, _meta) => ({
        payload: {id: userId, name, year},
        meta: _meta || {},
      }),
    }
  )

  test('without meta in action call', () => {
    const store = mockStore()
    return store.dispatch(fetchUserAction('01', 'james', '2020'))
      .then(result => {
        expect(result).toEqual({ id: '01', name: 'james', year: '2020' })

        const actions = store.getActions()

        actions.forEach(action => {
          expect(action.meta).toEqual({
            ignore: true,
            _toolbeltAsyncFnArgs: ['01', 'james', '2020'],
          })
        })

      })
  })

  test('with meta in action call', () => {
    const store = mockStore()
    return store.dispatch(fetchUserAction('01', 'james', '2020', {log: true}))
      .then(result => {
        expect(result).toEqual({ id: '01', name: 'james', year: '2020' })

        const actions = store.getActions()

        actions.forEach(action => {
          expect(action.meta).toEqual({
            ignore: true,
            log: true,
            _toolbeltAsyncFnArgs: ['01', 'james', '2020', {log: true}],
          })
        })

      })
  })

  test('with extra argument', done => {
    const store = mockStore()
    const customAction = makeAsyncThunkActionCreator('CUSTOM_ACTION', (...args) =>  {
      expect(args).toEqual([
        'arg1', 'arg2', {getState: args[2].getState, dispatch: args[2].dispatch, extraThunkArg: EXTRA_THUNK_ARG},
      ])
      done()
    })
    store.dispatch(customAction('arg1', 'arg2'))
  })
})

