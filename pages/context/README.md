We do not use any third-party state management tools, just useContext.
I think it's the simplest. But if you have lots of complex data, It will not help you organize your code.

```jsx
const Context = React.createContext()

// provider
const Store = ({ children }) => {
  const [state, setState] = useState()
  return (
  	<Context.Provider value={{ state, setState }} >
    	{children}
  	</Context.Provider>
	)
}

// use it
 const { state } = React.useContext(Context)

```

