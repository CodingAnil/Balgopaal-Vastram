import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should display the homepage correctly', async ({ page }) => {
    await page.goto('/')

    // Check if the main heading is visible
    await expect(
      page.getByRole('heading', { name: /welcome to ecom seo next15/i })
    ).toBeVisible()

    // Check if the hero section is present
    await expect(
      page.getByText(/a modern e-commerce website built with next.js 15/i)
    ).toBeVisible()

    // Check if the CTA buttons are present
    await expect(page.getByRole('link', { name: /learn more/i })).toBeVisible()
    await expect(
      page.getByRole('link', { name: /get in touch/i })
    ).toBeVisible()
  })

  test('should navigate to about page', async ({ page }) => {
    await page.goto('/')

    // Click on the "Learn More" button
    await page.getByRole('link', { name: /learn more/i }).click()

    // Check if we're on the about page
    await expect(page).toHaveURL('/about/')
    await expect(
      page.getByRole('heading', { name: /about our company/i })
    ).toBeVisible()
  })

  test('should navigate to contact page', async ({ page }) => {
    await page.goto('/')

    // Click on the "Get in Touch" button
    await page.getByRole('link', { name: /get in touch/i }).click()

    // Check if we're on the contact page
    await expect(page).toHaveURL('/contact/')
    await expect(
      page.getByRole('heading', { name: /contact us/i })
    ).toBeVisible()
  })

  test('should have proper SEO meta tags', async ({ page }) => {
    await page.goto('/')

    // Check title
    await expect(page).toHaveTitle(/ecom seo next15/i)

    // Check meta description
    const metaDescription = page.locator('meta[name="description"]')
    await expect(metaDescription).toHaveAttribute(
      'content',
      /welcome to our modern e-commerce platform/i
    )
  })
})
