import React from 'react'

export const Footer = () => {
  return (
    <div className='bg-base-100 p-4 flex flex-col gap-2 items-center justify-center h-24'>
        <p className='text-center text-sm'>© 2024 eBay Inc. All Rights Reserved.</p>
        <ul className='flex justify-center gap-4'>
            <li>Privacy</li>
            <li>Terms of Use</li>
            <li>Cookies</li>
        </ul>
    </div>
  )
}

export default Footer;
