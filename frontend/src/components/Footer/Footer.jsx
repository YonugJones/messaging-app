const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='footer'>
      <p>
        &copy; {currentYear} Created by <a href='https://github.com/YonugJones'>YonugJones</a>
      </p>
    </footer>
  )
}

export default Footer;