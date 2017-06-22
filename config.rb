###
# Page options, layouts, aliases and proxies
###

# Per-page layout changes:
#
# With no layout
page '/*.xml', layout: false
page '/*.json', layout: false
page '/*.txt', layout: false

page 'sitemap.html', layout: false
page 'sitemap.xml', layout: false

# With alternative layout
# page "/path/to/file.html", layout: :otherlayout

# Proxy pages (http://middlemanapp.com/basics/dynamic-pages/)
# proxy "/this-page-has-no-template.html", "/template-file.html", locals: {
#  which_fake_page: "Rendering a fake page with a local variable" }

# Blog settings
set :markdown_engine, :redcarpet
set :markdown, fenced_code_blocks: true, smartypants: true

set :css_dir, 'assets/stylesheets'
set :js_dir, 'assets/javascripts'
set :images_dir, 'assets/images'

###
# Helpers
###

activate :blog do |blog|
  # This will add a prefix to all links, template references and source paths
  # blog.prefix = "blog"

  # blog.permalink = "{year}/{month}/{day}/{title}.html"
  # Matcher for blog source files
  # blog.sources = "{year}-{month}-{day}-{title}.html"
  # blog.taglink = "tags/{tag}.html"
  # blog.layout = "layout"
   blog.summary_separator = /(READMORE)/
  # blog.summary_length = 250
  # blog.year_link = "{year}.html"
  # blog.month_link = "{year}/{month}.html"
  # blog.day_link = "{year}/{month}/{day}.html"
  # blog.default_extension = ".markdown"

  blog.tag_template = "tag.html"
  blog.calendar_template = "calendar.html"

  # Enable pagination
  # blog.paginate = true
  # blog.per_page = 10
  # blog.page_link = "page/{num}"
end

page "/feed.xml", layout: false
# Reload the browser automatically whenever files change
# configure :development do
   activate :livereload
# end

# Methods defined in the helpers block are available in templates
helpers do
  def strip_summary(html)
    html.gsub(/<h1.?>.+<\/h1>/, ””)
  end
end

# Build-specific configuration
configure :build do
  # activate :minify_css
   activate :minify_html
   activate :bootstrap_navbar
  # activate :minify_javascript
   activate :gzip
  # activate :asset_hash
  # activate :smusher
  # activate :asset_host
  # activate :relative_assets
  # activate :robots, rules: [
     # { user_agent: '*', allow: ['/'] }  
  # ],
   # sitemap: "#{data.site.url}/sitemap.xml"
   # activate :imageoptim do |options|
       # options.manifest = false
       # options.svgo = false
       # options.pngout = false
  # end
end
