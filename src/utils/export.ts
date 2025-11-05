/**
 * 导出表格工具
 * 使用 xlsx 库进行 Excel 导出
 */

import * as XLSX from 'xlsx'

/**
 * 表格列配置
 */
export interface ExportColumn<T = Record<string, unknown>> {
  key: string // 数据字段名
  title: string // 列标题
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formatter?: (value: any, row?: T) => string | number // 格式化函数
}

/**
 * 导出配置
 */
export interface ExportOptions<T = Record<string, unknown>> {
  data: T[] // 要导出的数据
  columns: ExportColumn<T>[] // 列配置
  filename?: string // 文件名（不含扩展名）
  sheetName?: string // sheet名称
}

/**
 * 导出 Excel
 * @param options 导出配置
 */
export const exportExcel = <T = Record<string, unknown>>(options: ExportOptions<T>) => {
  const { data, columns, filename = '导出数据', sheetName = 'Sheet1' } = options

  try {
    // 构建表头
    const headers = columns.map((col) => col.title)

    // 构建数据行
    const rows = data.map((row) => {
      return columns.map((col) => {
        const value = row[col.key]
        // 如果有格式化函数，使用格式化函数
        if (col.formatter) {
          return col.formatter(value, row)
        }
        // 处理特殊值
        if (value === null || value === undefined) {
          return ''
        }
        return value
      })
    })

    // 合并表头和数据
    const worksheetData = [headers, ...rows]

    // 创建工作表
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)

    // 设置列宽（可选）
    worksheet['!cols'] = columns.map((col) => ({
      wch: Math.max(col.title.length * 2, 10)
    }))

    // 创建工作簿
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

    // 生成文件并下载
    const now = new Date()
    const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`
    const finalFilename = `${filename}_${timestamp}.xlsx`

    XLSX.writeFile(workbook, finalFilename)

    return true
  } catch (error) {
    console.error('导出Excel失败:', error)
    throw new Error('导出失败')
  }
}

/**
 * 导出当前页面数据
 * @param options 导出配置
 */
export const exportCurrentPage = <T = Record<string, unknown>>(options: ExportOptions<T>) => {
  return exportExcel(options)
}

/**
 * 导出所有数据（通常配合API使用）
 * @param fetchAllData 获取所有数据的函数
 * @param columns 列配置
 * @param filename 文件名
 */
export const exportAllData = async <T = Record<string, unknown>>(
  fetchAllData: () => Promise<T[]>,
  columns: ExportColumn<T>[],
  filename?: string
) => {
  try {
    const data = await fetchAllData()
    return exportExcel({ data, columns, filename })
  } catch (error) {
    console.error('获取导出数据失败:', error)
    throw new Error('获取数据失败')
  }
}
