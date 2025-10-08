/* eslint-disable function-paren-newline */
/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import cn from 'classnames';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

export const App = () => {
  const [selectedUser, setSelectedUser] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);

  const resetFilters = () => {
    setSelectedUser('all');
    setSearchQuery('');
    setSelectedCategories([]);
  };

  const filteredProducts = productsFromServer.filter(product => {
    const category = categoriesFromServer.find(
      cat => cat.id === product.categoryId,
    );
    const users = category
      ? usersFromServer.find(user => user.id === category.ownerId)
      : null;

    const matchesUser = selectedUser === 'all' || users.id === selectedUser;
    const matchesSearch = users.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesCanegory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(category.id);

    return matchesUser && matchesSearch && matchesCanegory;
  });

  const toggleCategory = categoryId => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(catId => catId !== categoryId)
        : [...prev, categoryId],
    );
  };

  const clearCategories = () => setSelectedCategories([]);

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={selectedUser === 'all' ? 'is-active' : ''}
                onClick={() => setSelectedUser('all')}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  href="#/"
                  className={selectedUser === user.id ? 'is-active' : ''}
                  onClick={() => setSelectedUser(user.id)}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left">
                <input
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={event => setSearchQuery(event.target.value)}
                />
                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>
                {searchQuery && (
                  <span className="icon is-right">
                    <button
                      type="button"
                      className="delete"
                      onClick={() => setSearchQuery('')}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <button
                type="button"
                onClick={clearCategories}
                className={cn('button mr-2 my-1', {
                  'is-outlined': selectedCategories.length > 0,
                })}
              >
                All
              </button>

              {categoriesFromServer.map(cat => (
                <button
                  type="button"
                  key={cat.id}
                  className={cn('button mr-2 my-1', {
                    'is-info': selectedCategories.includes(cat.id),
                  })}
                  onClick={() => toggleCategory(cat.id)}
                >
                  {cat.title}
                </button>
              ))}
            </div>

            <div className="panel-block">
              <button
                type="button"
                className="button is-link is-outlined is-fullwidth"
                onClick={resetFilters}
              >
                Reset all filters
              </button>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {filteredProducts.length === 0 ? (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          ) : (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-down" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-up" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map(product => {
                  const category = categoriesFromServer.find(
                    cat => cat.id === product.categoryId,
                  );
                  const user = category
                    ? usersFromServer.find(u => u.id === category.ownerId)
                    : null;

                  return (
                    <tr key={product.id} data-cy="Product">
                      <td className="has-text-weight-bold" data-cy="ProductId">
                        {product.id}
                      </td>

                      <td data-cy="ProductName">{product.name}</td>

                      <td data-cy="ProductCategory">
                        {category ? `${category.icon} - ${category.title}` : ''}
                      </td>

                      <td
                        data-cy="ProductUser"
                        className={cn({
                          'has-text-link': user.sex === 'm',
                          'has-text-danger': user.sex === 'f',
                        })}
                      >
                        {user.name}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
