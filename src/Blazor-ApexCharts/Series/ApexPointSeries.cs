﻿using Microsoft.AspNetCore.Components;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace ApexCharts
{
    public class ApexPointSeries<TItem> : ApexBaseSeries<TItem> where TItem : class
    {
        [Parameter] public Expression<Func<TItem, decimal>> YValue { get; set; }
        [Parameter] public Expression<Func<IEnumerable<TItem>, decimal>> YAggregate { get; set; }
        [Parameter] public Expression<Func<DataPoint<TItem>, object>> OrderBy { get; set; }
        [Parameter] public Expression<Func<DataPoint<TItem>, object>> OrderByDescending { get; set; }
      

        protected override void OnInitialized()
        {
            base.OnInitialized();
            SetData();

        }

        private void SetData()
        {
            IEnumerable<DataPoint<TItem>> data;

            if (YValue != null)
            {
                data = Items.Select(e => new DataPoint<TItem>
                {
                    X = XValue.Compile().Invoke(e),
                    Y = YValue.Compile().Invoke(e),
                    Items = new List<TItem> { e }
                });

            }
            else if (YAggregate != null)
            {
                data = Items.GroupBy(e => XValue.Compile().Invoke(e))
               .Select(d => new DataPoint<TItem>
               {
                   X = d.Key,
                   Y = YAggregate.Compile().Invoke(d),
                   Items = d.ToList()
               });
            }
            else
            {
                return;
            }


            if (OrderBy != null)
            {
                data = data.OrderBy(o => OrderBy.Compile().Invoke(o));
            }
            else if (OrderByDescending != null)
            {
                data = data.OrderByDescending(o => OrderByDescending.Compile().Invoke(o));
            }

            series.Data = data;
        }
    }
}
