import { Navigate, Route, Routes } from 'react-router-dom'
import { BookPage } from './pages/BookPage'
import { BookThankYouPage } from './pages/BookThankYouPage'
import { QuotePage } from './pages/QuotePage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<QuotePage />} />
      <Route path="/book" element={<BookPage />} />
      <Route path="/book/thank-you" element={<BookThankYouPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
