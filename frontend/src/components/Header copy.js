
import React from "react";

function Header(){

    return(
<nav class="navbar navbar-dark bg-dark fixed-top">
  <div class="container-fluid">
    <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDarkNavbar" aria-controls="offcanvasDarkNavbar" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <a class="navbar-brand ms-2" href="#">Pieris P.S.G</a>
    <div class="offcanvas offcanvas-start text-bg-dark" tabindex="-1" id="offcanvasDarkNavbar" aria-labelledby="offcanvasDarkNavbarLabel">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="offcanvasDarkNavbarLabel">Exciting Travel Holidays</h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body">
        <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="/admin/propertycounts">Dashboard</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/add">Manage Properties</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/">Explore Properties</a>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Analyze Partner
            </a>
            <ul class="dropdown-menu dropdown-menu-dark">
              <li><a class="dropdown-item" href="#">Analyze Properties</a></li>
              <li><a class="dropdown-item" href="#">Analyze Tour Packages</a></li>
              <li><a class="dropdown-item" href="#">Analyze Vehicles</a></li>
              <li><a class="dropdown-item" href="#">Analyze Tour Guides</a></li>
              <li><a class="dropdown-item" href="#">Analyze Customer Base</a></li>
              <li><a class="dropdown-item" href="#">Analyze Enquiries</a></li>
              <li>
                <hr class="dropdown-divider"/>
              </li>
            </ul>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Recycle Bin</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/News">News</a>
          </li>
        </ul>
        <form class="d-flex mt-3" role="search">
          <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
          <button class="btn btn-success" type="submit">Search</button>
        </form>
      </div>
    </div>
  </div>
</nav>

    )
}


export default Header;