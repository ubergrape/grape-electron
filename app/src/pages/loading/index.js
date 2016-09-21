function render() {
  document.title = 'Loading Grape'
  document.body.innerHTML = `
    <style type="text/css">
      html, body
      {
        height: 100%
      }
      body
      {
        background: #fff url("../images/loading.gif") 50% 50% no-repeat;
      }
    </style>
  `
}

if (location.search === '?page=loading') render()
